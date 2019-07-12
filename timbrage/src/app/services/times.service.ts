import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { TimeModel, Time, DATETIME_ISO_FORMAT, TimeAdapter } from '../models/time.model';
import * as moment from 'moment';
import { mergeMap, map } from 'rxjs/operators';

@Injectable()
export class TimesService {
  constructor(private firestore: AngularFirestore, private fireauth: AngularFireAuth) {}

  public read(date: string): Observable<Time[]> {
    // define timestamp range
    const start = moment(date).startOf('day');
    const end = moment(date).endOf('day');

    return this.fireauth.authState.pipe(
      mergeMap(user =>
        this.firestore
          .collection<TimeModel>(`users/${user.uid}/times`, ref =>
            ref.where('timestamp', '>=', start.utc().valueOf()).where('timestamp', '<=', end.utc().valueOf())
          )
          .snapshotChanges()
      ),
      map(times =>
        times.map(
          doc =>
            ({
              id: doc.payload.doc.id,
              time: moment(doc.payload.doc.data().timestamp).format(DATETIME_ISO_FORMAT)
            } as Time)
        )
      )
    );
  }

  public create(time: Time): Observable<Time> {
    const timestamp = {
      timestamp: new TimeAdapter(time).timestamp
    };
    return this.fireauth.authState.pipe(
      mergeMap(user => this.firestore.collection<TimeModel>(`users/${user.uid}/times`).add(timestamp)),
      map(
        doc =>
          ({
            id: doc.id,
            ...time
          } as Time)
      )
    );
  }

  public update(time: Time): Observable<Time> {
    const timestamp = {
      timestamp: new TimeAdapter(time).timestamp
    } as TimeModel;
    return this.fireauth.authState.pipe(
      mergeMap(user =>
        this.firestore
          .collection<TimeModel>(`users/${user.uid}/times`)
          .doc(time.id)
          .update(timestamp)
      ),
      map(() => time)
    );
  }

  public delete(time: Time): Observable<void> {
    return this.fireauth.authState.pipe(
      mergeMap(user =>
        this.firestore
          .collection<TimeModel>(`users/${user.uid}/times`)
          .doc(time.id)
          .delete()
      )
    );
  }
}
