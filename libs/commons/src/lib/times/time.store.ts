import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import * as moment from 'moment';
import { Moment } from 'moment';
import { from } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { SettingsState } from '../settings/settings.store';
import { MONTH_ISO_FORMAT, Time } from './time.model';
import { TimesService } from './times.service';

export interface TimesStateModel {
  selectedDate: Moment | string;
  holidays: string[];
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

export class CheckWriteRights {
  static readonly type = '[Time] CheckWriteRights]';
}

@State<TimesStateModel>({
  name: 'times',
  defaults: {
    selectedDate: moment(),
    holidays: []
  }
})
@Injectable()
export class TimesState {
  constructor(private readonly store: Store, private readonly timesService: TimesService) {}

  @Selector()
  public static selectedDate(state: TimesStateModel): Moment {
    return moment(state.selectedDate);
  }

  @Selector()
  public static selectedMonth(state: TimesStateModel): string {
    return moment(state.selectedDate).format(MONTH_ISO_FORMAT);
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
    return this.store.selectOnce(SettingsState.project).pipe(mergeMap(project => this.timesService.create(project, action.time)));
  }

  @Action(AddTimes)
  addTimes(ctx: StateContext<TimesStateModel>, action: AddTimes) {
    return from(action.times).pipe(mergeMap((time: Time) => ctx.dispatch(new AddTime(time))));
  }

  @Action(UpdateTime)
  updateTime(ctx: StateContext<TimesStateModel>, action: UpdateTime) {
    return this.store.selectOnce(SettingsState.project).pipe(mergeMap(project => this.timesService.update(project, action.time)));
  }

  @Action(DeleteTime)
  deleteTime(ctx: StateContext<TimesStateModel>, action: DeleteTime) {
    return this.store.selectOnce(SettingsState.project).pipe(mergeMap(project => this.timesService.delete(project, action.time)));
  }

  @Action(DeleteTimes)
  deleteTimes(ctx: StateContext<TimesStateModel>, action: DeleteTimes) {
    return from(action.times).pipe(mergeMap((time: Time) => ctx.dispatch(new DeleteTime(time))));
  }

  @Action(CheckWriteRights)
  checkWriteRights(ctx: StateContext<TimesStateModel>) {
    return this.store.selectOnce(SettingsState.project).pipe(
      mergeMap(project => this.timesService.verifyWriteRights$(project, moment(ctx.getState().selectedDate).format(MONTH_ISO_FORMAT))),
      take(1)
    );
  }
}
