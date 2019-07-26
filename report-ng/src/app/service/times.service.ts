import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { mergeMap, map, take } from 'rxjs/operators';
import { Moment } from 'moment';
import { ISO_MONTH, Time, TimeModel, ISO_DATE_TIME } from '../model/time.model';
import { Store } from '@ngxs/store';
import { ProjectState } from '../store/project.store';

@Injectable({
  providedIn: 'root'
})
export class TimesService {
  constructor(private firestore: AngularFirestore, private fireauth: AngularFireAuth, private store: Store) {}

  public read(date: string | Moment): Observable<Time[]> {
    // define timestamp range
    let start = moment(date).startOf('day');
    let end = moment(date).endOf('day');
    if (typeof date === 'string' && date.length === ISO_MONTH.length) {
      start = start.startOf('month');
      end = end.endOf('month');
    }
    return this.readBetween(start, end);
  }

  public readBetween(start: Moment, end: Moment): Observable<Time[]> {
    const projectName = this.store.selectSnapshot(ProjectState.project);
    return this.fireauth.user.pipe(
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
      map(docs => docs.map(doc => new Time(moment(doc.payload.doc.data().timestamp).format(ISO_DATE_TIME), doc.payload.doc.id)))
    );
  }

  public create(time: Time): Observable<Time> {
    const projectName = this.store.selectSnapshot(ProjectState.project);
    const timestamp = {
      timestamp: time.timestamp
    };
    return this.fireauth.user.pipe(
      mergeMap(user => this.firestore.collection<TimeModel>(`users/${user.uid}/projects/${projectName}/times`).add(timestamp)),
      take(1),
      map(doc => new Time(time.time, doc.id))
    );
  }

  public update(time: Time): Observable<Time> {
    const projectName = this.store.selectSnapshot(ProjectState.project);
    const timestamp = {
      timestamp: time.timestamp
    } as TimeModel;
    return this.fireauth.user.pipe(
      mergeMap(user =>
        this.firestore
          .collection<TimeModel>(`users/${user.uid}/projects/${projectName}/times`)
          .doc(time.id)
          .update(timestamp)
      ),
      take(1),
      map(() => time)
    );
  }

  public delete(time: Time): Observable<void> {
    const projectName = this.store.selectSnapshot(ProjectState.project);
    return this.fireauth.user.pipe(
      mergeMap(user =>
        this.firestore
          .collection<TimeModel>(`users/${user.uid}/projects/${projectName}/times`)
          .doc(time.id)
          .delete()
      ),
      take(1)
    );
  }
}
