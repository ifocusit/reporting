import { Time } from '../models/time.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
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
    loading: false,
    times: []
  }
})
export class TimesState {
  constructor() {}

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
      times: []
    });
  }

  @Action(ReadedTimes)
  readedTimes(ctx: StateContext<TimesStateModel>, action: ReadedTimes) {
    ctx.patchState({
      loading: false,
      times: action.times
    });
  }

  @Action(AddTime)
  addTime(ctx: StateContext<TimesStateModel>, action: AddTime) {
    const state = ctx.getState();
    ctx.patchState({
      loading: true
    });
  }

  @Action(UpdateTime)
  updateTime(ctx: StateContext<TimesStateModel>, action: UpdateTime) {
    ctx.patchState({
      loading: true
    });
  }

  @Action(DeleteTime)
  deleteTime(ctx: StateContext<TimesStateModel>, action: DeleteTime) {
    ctx.patchState({
      loading: true
    });
  }

  @Action(DeleteTimes)
  deleteTimes(ctx: StateContext<TimesStateModel>, action: DeleteTimes) {
    return from(action.times).pipe(mergeMap((time: Time) => ctx.dispatch(new DeleteTime(time))));
  }
}
