import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as moment from 'moment';
import { Moment } from 'moment';

export const DATETIME_ISO_FORMAT = 'YYYY-MM-DDTHH:mm';
export const DATE_ISO_FORMAT = 'YYYY-MM-DD';
export const MONTH_ISO_FORMAT = 'YYYY-MM';
export const TIME_ISO_FORMAT = 'HH:mm';

export type Unit = 'day' | 'week' | 'month';

@Injectable()
export class TimeService {
  public times(user: string, project: string, date: string | Moment, unit: Unit = 'month'): Promise<Moment[]> {
    // define timestamp range
    let start = moment(date).startOf('day');
    let end = moment(date).endOf('day');

    if (unit === 'month') {
      start = start.startOf('month');
      end = end.endOf('month');
    } else if (unit === 'week') {
      start = start.startOf('week');
      end = end.endOf('week');
    }

    return this.timesBetween(user, project, start, end);
  }

  private timesBetween(user: string, project: string, start: Moment, end: Moment): Promise<Moment[]> {
    return firebase
      .firestore()
      .collection(`users/${user}/projects/${project}/times`)
      .where('timestamp', '>=', start.valueOf())
      .where('timestamp', '<=', end.valueOf())
      .orderBy('timestamp')
      .get()
      .then(results => results.docs.map(doc => moment(doc.data().timestamp)));
  }

  public insertTimes(user: any, project: any, times: string[]) {
    const db = firebase.firestore();
    db.collection(`users/${user}/projects/${project}/times`)
      .get()
      .then(results => results.docs.map(doc => moment(doc.data().timestamp)));
    const batch = db.batch();
    times.forEach(time =>
      batch.create(db.collection(`users/${user}/projects/${project}/times`).doc(time), { timestamp: moment(time).valueOf() })
    );
    return batch.commit();
  }
}
