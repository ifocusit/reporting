import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { TimeModel, Time, MONTH_ISO_FORMAT, DATETIME_ISO_FORMAT } from './time.model';
import * as moment from 'moment';
import { Moment } from 'moment';
import { mergeMap, map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class TimesService {
  constructor(private firestore: AngularFirestore, private fireauth: AngularFireAuth) {}

  public read(date: string | Moment): Observable<Time[]> {
    // define timestamp range
    let start = moment(date).startOf('day');
    let end = moment(date).endOf('day');
    if (typeof date === 'string' && date.length === MONTH_ISO_FORMAT.length) {
      start = start.startOf('month');
      end = end.endOf('month');
    }
    return this.readBetween(start, end);
  }

  public readBetween(start: Moment, end: Moment): Observable<Time[]> {
    const projectName = 'Default'; // this.store.selectSnapshot(ProjectState.project);
    return this.fireauth.authState.pipe(
      mergeMap(user =>
        this.firestore
          .collection<TimeModel>(`users/${user.uid}/projects/${projectName}/times`, ref =>
            ref
              .where('timestamp', '>=', start.valueOf())
              .where('timestamp', '<=', end.valueOf())
              .orderBy('timestamp')
          )
          .snapshotChanges()
      ),
      map(docs =>
        docs.map(
          doc =>
            ({
              id: doc.payload.doc.id,
              time: moment(doc.payload.doc.data().timestamp).format(DATETIME_ISO_FORMAT)
            } as Time)
        )
      )
    );
  }

  public get times$(): Observable<TimeModel[]> {
    return this.firestore.collection<TimeModel>(`users/26nyWKtW2ISZHIU5bZ6kHn7JISf1/projects/Default/times`).valueChanges();
  }
}
