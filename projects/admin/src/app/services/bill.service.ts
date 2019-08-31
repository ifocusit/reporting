import { Injectable } from '@angular/core';
import { AuthService } from 'projects/commons/src/lib/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { mergeMap, take, map } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { ProjectState } from 'projects/commons/src/lib/settings/project.store';
import { Observable } from 'rxjs';
import { BillLine } from '../models/bill.model';
import { Duration } from 'moment';
import { TimesState } from 'projects/commons/src/lib/times/time.store';
import { User } from 'projects/commons/src/lib/auth/user.model';
import * as moment from 'moment';

interface BillData {
  user: User;
  project: string;
  month: string;
}

@Injectable()
export class BillService {
  constructor(private authService: AuthService, private firestore: AngularFirestore, private store: Store) {}

  public addLine(line: BillLine) {
    return this.readData().pipe(
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
      mergeMap(bill =>
        this.firestore
          .collection<any>(`users/${bill.user.uid}/projects/${bill.project}/bills/${bill.month}/lines`)
          .doc(line.id)
          .delete()
      ),
      take(1)
    );
  }

  public get lines$(): Observable<BillLine[]> {
    return this.readData().pipe(
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

  private readData(): Observable<BillData> {
    return this.authService.user$.pipe(
      mergeMap(user =>
        this.store
          .selectOnce(ProjectState.project)
          .pipe(mergeMap(project => this.store.selectOnce(TimesState.selectedMonth).pipe(map(month => ({ user, project, month })))))
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
}
