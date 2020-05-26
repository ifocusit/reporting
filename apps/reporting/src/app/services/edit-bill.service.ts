import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Bill, BillService, UserService } from '@ifocusit/commons';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { Duration } from 'moment';
import { Observable } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { BillLine } from '../models/bill.model';

@Injectable()
export class EditBillService extends BillService {
  constructor(userService: UserService, firestore: AngularFirestore, private firestorage: AngularFireStorage, store: Store) {
    super(userService, firestore, store);
  }

  public addLine(line: BillLine) {
    return this.readData().pipe(
      take(1),
      mergeMap(bill =>
        this.firestore.collection<any>(`users/${bill.user.uid}/projects/${bill.project}/bills/${bill.month}/lines`).add({
          ...line,
          timestamp: moment().valueOf()
        })
      ),
      take(1),
      map(doc => ({
        id: doc.id,
        ...line
      }))
    );
  }

  public updateLine(line: BillLine) {
    return this.readData().pipe(
      take(1),
      mergeMap(bill =>
        this.firestore
          .collection<any>(`users/${bill.user.uid}/projects/${bill.project}/bills/${bill.month}/lines`)
          .doc(line.id)
          .update({ label: line.label, amount: line.amount })
      ),
      take(1)
    );
  }

  public deleteLine(line: BillLine) {
    return this.readData().pipe(
      take(1),
      mergeMap(bill =>
        this.firestore.collection<any>(`users/${bill.user.uid}/projects/${bill.project}/bills/${bill.month}/lines`).doc(line.id).delete()
      ),
      take(1)
    );
  }

  public get lines$(): Observable<BillLine[]> {
    return this.readData().pipe(
      take(1),
      mergeMap(bill =>
        this.firestore
          .collection<BillLine>(`users/${bill.user.uid}/projects/${bill.project}/bills/${bill.month}/lines`, ref =>
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

  public calculatWorkAmount(duration: Duration, hourlyRate: number): number {
    return duration.asHours() * hourlyRate;
  }

  private sumLinesAmount(lines: BillLine[]): number {
    const amounts = lines.map(line => +line.amount).filter(value => !Number.isNaN(value));
    return amounts.length > 0 ? amounts.reduce((accu, currentValue) => accu + currentValue) : 0;
  }

  public calculateHT(duration: Duration, hourlyRate: number, lines: BillLine[]) {
    return this.sumLinesAmount(lines) + this.calculatWorkAmount(duration, hourlyRate);
  }

  public calculateTVA(duration: Duration, hourlyRate: number, tvaRate: number, lines: BillLine[]) {
    return (this.calculateHT(duration, hourlyRate, lines) * tvaRate) / 100;
  }

  public calculateTTC(duration: Duration, hourlyRate: number, tvaRate: number, lines: BillLine[]) {
    return this.calculateHT(duration, hourlyRate, lines) + this.calculateTVA(duration, hourlyRate, tvaRate, lines);
  }

  public archive(bill: File) {
    return this.readData().pipe(
      take(1),
      mergeMap(data =>
        this.firestorage
          .upload(`users/${data.user.uid}/${data.project}/${data.month}.pdf`, bill)
          .snapshotChanges()
          .pipe(
            tap(task => {
              if (task.bytesTransferred === task.totalBytes) {
                // Update firestore on completion
                task.ref
                  .getDownloadURL()
                  .then(url =>
                    this.firestore
                      .doc<Bill>(`users/${data.user.uid}/projects/${data.project}/bills/${data.month}`)
                      .set({ archived: true, billUrl: url }, { merge: true })
                  );
              }
            })
          )
      )
    );
  }
}
