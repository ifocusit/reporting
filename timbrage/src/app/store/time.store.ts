import { Time, TimeAdapter, DATE_ISO_FORMAT, DATETIME_ISO_FORMAT, MONTH_ISO_FORMAT, TimeModel } from '../models/time.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { defaultIfEmpty, map, mergeMap, tap, switchMap, timestamp } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Moment } from 'moment';
import { from, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

export interface TimesStateModel {
  date: string;
  times: Time[];
}

export class AddTime {
  static readonly type = '[Time] Add Time(s)';

  constructor(public times: Time[]) {}
}

export class UpdateTime {
  static readonly type = '[Time] Update Time';

  constructor(public time: Time) {}
}

export class DeleteTime {
  static readonly type = '[Time] Delete Time';

  constructor(public time: Time) {}
}

export class DeleteTimes {
  static readonly type = '[Time] Delete Times';

  constructor(public times: Time[]) {}
}

export class ReadTimes {
  static readonly type = '[Time] Read Times';

  constructor(public date: string) {}
}

export class ReadedTimes {
  static readonly type = '[Time] Readed Times';

  constructor(public times: Time[]) {}
}

@State<TimesStateModel>({
  name: 'times',
  defaults: {
    date: moment().format('YYYY-MM-DD'),
    times: []
  }
})
export class TimesState {
  constructor(private firestore: AngularFirestore, private fireauth: AngularFireAuth) {}

  // SELECTORS

  @Selector()
  public static times(state: TimesStateModel) {
    return _.orderBy(state.times, ['time'], ['asc']);
  }

  @Selector()
  public static date(state: TimesStateModel): Moment {
    return moment(state.date);
  }

  // ACTIONS

  @Action(ReadTimes)
  readTimes(ctx: StateContext<TimesStateModel>, action: ReadTimes) {
    ctx.patchState({
      date: action.date,
      times: []
    });
    // define timestamp range
    let start = moment(action.date).startOf('day');
    let end = moment(action.date).endOf('day');

    return this.fireauth.user.pipe(
      mergeMap(user => this.firestore
        .collection<TimeModel>(`users/${user.uid}/times`, ref => ref
          .where('timestamp', '>=', start.utc().valueOf())
          .where('timestamp', '<=', end.utc().valueOf())
        )
        .snapshotChanges()),
      map(times => times.map(data => ({
        id: data.payload.doc.id, 
        time: moment(data.payload.doc.data().timestamp).format(DATETIME_ISO_FORMAT)
      } as Time))),
      mergeMap(times => ctx.dispatch(new ReadedTimes(times)))
    );
  }

  @Action(ReadedTimes)
  readedTimes(ctx: StateContext<TimesStateModel>, action: ReadedTimes) {
    ctx.patchState({
      times: action.times
    });
  }

  @Action(AddTime)
  addTime(ctx: StateContext<TimesStateModel>, action: AddTime) {
    const time = action.times.map(time => ({
      timestamp: new TimeAdapter(time).timestamp
    } as TimeModel))[0];
    return this.fireauth.user.pipe(
      mergeMap(user => this.firestore.collection<TimeModel>(`users/${user.uid}/times`).add(time))
    );
  }

  @Action(UpdateTime)
  updateTime(ctx: StateContext<TimesStateModel>, action: UpdateTime) {
    const timestamp = {
      timestamp: new TimeAdapter(action.time).timestamp
    } as TimeModel;
    return this.fireauth.user.pipe(
      mergeMap(user => this.firestore.collection<TimeModel>(`users/${user.uid}/times`).doc(action.time.id).update(timestamp))
    );
  }

  @Action(DeleteTime)
  deleteTime(ctx: StateContext<TimesStateModel>, action: DeleteTime) {
    return this.fireauth.user.pipe(
      switchMap(user => this.firestore.collection<TimeModel>(`users/${user.uid}/times`).doc(action.time.id).delete())
    );
  }

  @Action(DeleteTimes)
  deleteTimes(ctx: StateContext<TimesStateModel>, action: DeleteTimes) {
    return from(action.times).pipe(mergeMap((time: Time) => ctx.dispatch(new DeleteTime(time))));
  }
}
