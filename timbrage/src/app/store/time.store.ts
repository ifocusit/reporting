import { Time } from '../models/time.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { TimesClientService } from '../services/times-client.service';
import { defaultIfEmpty, map, mergeMap, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Moment } from 'moment';
import { from } from 'rxjs';

export interface TimesStateModel {
  loading: boolean;
  date: string;
  times: Time[];
}

export class AddTime {
  static readonly type = '[Time] Add Time(s)';

  constructor(public times: Time[], public uniq = false) {}
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
    loading: false,
    times: [],
  },
})
export class TimesState {
  constructor(private timeClient: TimesClientService) {}

  // SELECTORS

  @Selector()
  public static loading(state: TimesStateModel) {
    return state.loading;
  }

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
      loading: true,
      date: action.date,
      times: [],
    });

    return this.timeClient.read(action.date).pipe(
      map((times: Time[]) => ctx.dispatch(new ReadedTimes(times)))
      // defaultIfEmpty(
      // ctx.patchState({
      // loading: false,
      // })
      // )
    );
  }

  @Action(ReadedTimes)
  readedTimes(ctx: StateContext<TimesStateModel>, action: ReadedTimes) {
    ctx.patchState({
      loading: false,
      times: action.times,
    });
  }

  @Action(AddTime)
  addTime(ctx: StateContext<TimesStateModel>, action: AddTime) {
    const state = ctx.getState();
    ctx.patchState({
      loading: true,
    });
    return this.timeClient.create(action.times, action.uniq).pipe(
      map((times: Time[]) => times.filter((time: Time) => time.time.startsWith(state.date))),
      tap(times =>
        ctx.patchState({
          loading: false,
          times: times,
        })
      )
      // defaultIfEmpty(
      //   ctx.patchState({
      //     loading: false,
      //   })
      // )
    );
  }

  @Action(UpdateTime)
  updateTime(ctx: StateContext<TimesStateModel>, action: UpdateTime) {
    ctx.patchState({
      loading: true,
    });
    return this.timeClient.update(action.time).pipe(
      tap((time: Time) => {
        ctx
          .getState()
          .times.filter(value => value.id === time.id)
          .forEach(value => (value.time = time.time));
        ctx.patchState({
          loading: false,
        });
      })
    );
  }

  @Action(DeleteTime)
  deleteTime(ctx: StateContext<TimesStateModel>, action: DeleteTime) {
    ctx.patchState({
      loading: true,
    });
    return this.timeClient.delete(action.time).pipe(
      tap(() => {
        ctx.patchState({
          loading: false,
          times: ctx.getState().times.filter(time => time.id !== action.time.id),
        });
      })
    );
  }

  @Action(DeleteTimes)
  deleteTimes(ctx: StateContext<TimesStateModel>, action: DeleteTimes) {
    return from(action.times).pipe(mergeMap((time: Time) => ctx.dispatch(new DeleteTime(time))));
  }
}
