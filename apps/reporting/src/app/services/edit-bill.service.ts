import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { asHours, Bill, BillData, BillService, round, UserService } from '@ifocusit/commons';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { Duration } from 'moment';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { BillLine } from '../models/bill.model';
import { ResumeMonthService } from './resume-month.service';

export interface Attachment {
  name: string;
  url: string;
}

@Injectable()
export class EditBillService extends BillService {
  constructor(
    userService: UserService,
    firestore: AngularFirestore,
    store: Store,
    private firestorage: AngularFireStorage,
    private resumeMonthService: ResumeMonthService,
    private httpClient: HttpClient
  ) {
    super(userService, firestore, store);
  }

  public addLine(line: BillLine) {
    return this.readData()
      .pipe(
        take(1),
        mergeMap(data =>
          this.firestore.collection<any>(`users/${data.user.uid}/projects/${data.settings.project.name}/bills/${data.month}/lines`).add({
            ...line,
            timestamp: moment().valueOf()
          })
        ),
        take(1),
        map(doc => ({
          id: doc.id,
          ...line
        }))
      )
      .toPromise();
  }

  public updateLine(line: BillLine) {
    return this.readData()
      .pipe(
        take(1),
        mergeMap(data =>
          this.firestore
            .collection<any>(`users/${data.user.uid}/projects/${data.settings.project.name}/bills/${data.month}/lines`)
            .doc(line.id)
            .update({ label: line.label, amount: line.amount })
        ),
        take(1)
      )
      .toPromise();
  }

  public deleteLine(line: BillLine) {
    return this.readData()
      .pipe(
        take(1),
        mergeMap(data =>
          this.firestore
            .collection<any>(`users/${data.user.uid}/projects/${data.settings.project.name}/bills/${data.month}/lines`)
            .doc(line.id)
            .delete()
        ),
        take(1)
      )
      .toPromise();
  }

  public get lines$(): Observable<BillLine[]> {
    return this.readData().pipe(
      take(1),
      mergeMap(data =>
        this.firestore
          .collection<BillLine>(`users/${data.user.uid}/projects/${data.settings.project.name}/bills/${data.month}/lines`, ref =>
            ref.orderBy('timestamp')
          )
          .snapshotChanges()
      ),
      map(docs =>
        docs.map(
          doc =>
            ({
              id: doc.payload.doc.id,
              ...doc.payload.doc.data()
            } as BillLine)
        )
      )
    );
  }

  private sumLinesAmount(lines: BillLine[]): number {
    const amounts = lines
      .map(line => +line.amount.toString().replace("'", '').replace(',', '').replace(' ', ''))
      .filter(value => !Number.isNaN(value));
    return amounts.length > 0 ? amounts.reduce((accu, currentValue) => accu + currentValue) : 0;
  }

  public calculatWorkAmount(duration: Duration, hourlyRate: number): number {
    return round(asHours(duration) * hourlyRate);
  }

  public calculateHT(duration: Duration, hourlyRate: number, lines: BillLine[]) {
    return this.sumLinesAmount(lines) + this.calculatWorkAmount(duration, hourlyRate);
  }

  public calculateTVA(duration: Duration, hourlyRate: number, tvaRate: number, lines: BillLine[]) {
    return round(this.calculateHT(duration, hourlyRate, lines) * tvaRate) / 100;
  }

  public calculateTTC(duration: Duration, hourlyRate: number, tvaRate: number, lines: BillLine[]) {
    return this.calculateHT(duration, hourlyRate, lines) + this.calculateTVA(duration, hourlyRate, tvaRate, lines);
  }

  public archive$(invoicePdf: File) {
    return this.readData().pipe(
      take(1),
      mergeMap(data =>
        this.firestorage
          .upload(`users/${data.user.uid}/${data.settings.project.name}/${data.month}.pdf`, invoicePdf)
          .snapshotChanges()
          .pipe(
            tap(task => {
              if (task.bytesTransferred === task.totalBytes) {
                task.ref.getDownloadURL().then(url => this.archiveBill(data, url));
              }
            })
          )
      )
    );
  }

  private archiveBill(billData: BillData, pdfFileUrl: string): Promise<void> {
    return combineLatest([this.resumeMonthService.resume$(billData.month), this.lines$])
      .pipe(
        take(1),
        map(
          data =>
            ({
              month: billData.month,
              archived: true,
              billUrl: pdfFileUrl,
              detail: {
                nbWorkDays: data[0].nbWorkDays,
                mustWorkDuration: data[0].mustDuration.toISOString(),
                timeWorkDuration: data[0].total.toISOString(),
                timeWorkAmountHt: this.calculatWorkAmount(data[0].total, billData.settings.bill.hourlyRate),
                linesAmountHt: this.sumLinesAmount(data[1]),
                hourlyRate: billData.settings.bill.hourlyRate,
                tvaRate: billData.settings.bill.tvaRate
              }
            } as Bill)
        ),
        mergeMap(bill =>
          this.firestore
            .doc<Bill>(`users/${billData.user.uid}/projects/${billData.settings.project.name}/bills/${billData.month}`)
            .set(bill, { merge: true })
        )
      )
      .toPromise();
  }

  public get attachments$(): Observable<Array<Attachment>> {
    return this.readData().pipe(
      take(1),
      mergeMap(data => this.firestorage.ref(`users/${data.user.uid}/${data.settings.project.name}/${data.month}`).listAll()),
      mergeMap(results => Promise.all(results.items.map(child => child.getDownloadURL().then(url => ({ url, name: child.name })))))
    );
  }

  public addAttachment$(attachment: File) {
    return this.readData().pipe(
      take(1),
      mergeMap(data =>
        this.firestorage
          .upload(`users/${data.user.uid}/${data.settings.project.name}/${data.month}/${attachment.name}`, attachment)
          .snapshotChanges()
      )
    );
  }

  public deleteAttachment(attachment: Attachment) {
    return this.readData()
      .pipe(
        take(1),
        mergeMap(data =>
          this.firestorage.ref(`users/${data.user.uid}/${data.settings.project.name}/${data.month}/${attachment.name}`).delete()
        )
      )
      .toPromise();
  }

  public generateBillPdf() {
    this.readData()
      .pipe(
        take(1),
        mergeMap(data =>
          this.httpClient.get(`/api/users/${data.user.uid}/projects/${data.settings.project.name}/bills/${data.month}/merge`, {
            responseType: 'arraybuffer' as 'json'
          })
        ),
        tap(data => this.downLoadFile(data, 'application/pdf'))
      )
      .toPromise();
  }

  private downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url, '_blank');
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }
}
