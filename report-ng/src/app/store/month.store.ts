import { Action, Selector, State, StateContext } from '@ngxs/store';
import { mergeMap } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Moment } from 'moment';
import { from } from 'rxjs';
import { Time } from 'src/app/model/time.model';
import { TimesService } from 'src/app/service/times.service';

export interface TimesStateModel {
  selectedDate: Moment;
}

export class SelectDate {
  static readonly type = '[Calendar] Set Date';

  constructor(public date: Moment) {}
}

export class MoveMonth {
  static readonly type = '[Calendar] Move Month';

  constructor(public change: number) {}
}

export class AddTime {
  static readonly type = '[Time] Add Time';

  constructor(public time: Time) {}
}

export class AddTimes {
  static readonly type = '[Time] Add Times';

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
    selectedDate: moment()
  }
})
export class TimesState {
  constructor(private timesService: TimesService) {}

  @Selector()
  public static selectedDate(state: TimesStateModel): Moment {
    return state.selectedDate;
  }

  @Action(SelectDate)
  selectDate(ctx: StateContext<TimesStateModel>, action: SelectDate) {
    return ctx.patchState({
      selectedDate: action.date
    });
  }

  @Action(MoveMonth)
  moveMonth(ctx: StateContext<TimesStateModel>, action: MoveMonth) {
    const moveTo = moment(ctx.getState().selectedDate).add(action.change, 'months');
    return ctx.dispatch(new SelectDate(moveTo));
  }

  @Action(AddTime)
  addTime(ctx: StateContext<TimesStateModel>, action: AddTime) {
    return this.timesService.create(action.time);
  }

  @Action(AddTimes)
  addTimes(ctx: StateContext<TimesStateModel>, action: AddTimes) {
    return from(action.times).pipe(mergeMap((time: Time) => ctx.dispatch(new AddTime(time))));
  }

  @Action(UpdateTime)
  updateTime(ctx: StateContext<TimesStateModel>, action: UpdateTime) {
    return this.timesService.update(action.time);
  }

  @Action(DeleteTime)
  deleteTime(ctx: StateContext<TimesStateModel>, action: DeleteTime) {
    return this.timesService.delete(action.time);
  }

  @Action(DeleteTimes)
  deleteTimes(ctx: StateContext<TimesStateModel>, action: DeleteTimes) {
    return from(action.times).pipe(mergeMap((time: Time) => ctx.dispatch(new DeleteTime(time))));
  }
}
