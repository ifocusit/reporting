// **************************************************************************************/
// STATE
// **************************************************************************************/

// description de l'état
import * as moment from 'moment';
import { Moment } from 'moment';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { DATE_ISO_FORMAT, MONTH_ISO_FORMAT, Time, TimeAdapter } from '../models/time.model';
import { catchError, defaultIfEmpty, map, toArray } from 'rxjs/operators';
import { ReadTimes, TimesState, TimesStateModel } from './time.store';

export interface CalendarDayModel {
  date: Moment;
  hasTimes: boolean;
}

export interface CalendarStateModel {
  loading: boolean;
  days: CalendarDayModel[];
  month: string;
}

// **************************************************************************************/
// ACTIONS
// **************************************************************************************/

export class SelectDate {
  static readonly type = '[Calendar] Set Date';

  constructor(public date: Moment) {}
}

export class MoveMonth {
  static readonly type = '[Calendar] Move Month';

  constructor(public change: number) {}
}

export class MonthTimesReaded {
  static readonly type = '[Calendar] Month Times Readed';

  constructor(public date: string, public times: Time[][]) {}
}

// **************************************************************************************/
// MUTATIONS SUR L'ETAT
// **************************************************************************************/
@State<CalendarStateModel>({
  name: 'calendar',
  defaults: {
    loading: false,
    month: '',
    days: []
  },
  children: [TimesState]
})
export class CalendarState {
  constructor() {}

  // SELECTORS

  @Selector()
  public static days(state: CalendarStateModel) {
    return state.days;
  }

  public static getDaysInMonth(selectedDate: string): Moment[] {
    const days = [];
    let date = moment(selectedDate).date(1);
    while (date.days() !== 0) {
      date.add(-1, 'days');
      days.unshift(moment(date));
    }
    date = moment(selectedDate).date(1);
    const daysInMonth = date.daysInMonth();
    for (let i = 0; i < daysInMonth; i++) {
      days.push(moment(date));
      date.add(1, 'days');
    }
    while (days.length < 35) {
      days.push(moment(date));
      date.add(1, 'days');
    }
    if (days.length > 35) {
      while (days.length < 42) {
        days.push(moment(date));
        date.add(1, 'days');
      }
    }

    return days;
  }

  // ACTIONS

  @Action(SelectDate)
  selectDate(ctx: StateContext<CalendarStateModel>, action: SelectDate) {
    // comment this lines to force reload all month
    // if (ctx.getState().month === action.date.format(MONTH_ISO_FORMAT)) {
    //   // month don't change => only reload day times
    //   return ctx.dispatch(new ReadTimes(action.date.format(DATE_ISO_FORMAT)));
    // }

    ctx.patchState({
      loading: true,
      month: action.date.format(MONTH_ISO_FORMAT)
    });
  }

  @Action(MonthTimesReaded)
  monthTimesReaded(ctx: StateContext<CalendarStateModel>, action: MonthTimesReaded) {
    // list of days having times
    const daysWithTimes = [];
    action.times.filter(times => times.length > 0).forEach(times => daysWithTimes.push(new TimeAdapter(times[0]).getDay()));

    const state = ctx.getState();
    const days = CalendarState.getDaysInMonth(action.date);
    ctx.patchState({
      loading: false,
      days: days.map(date => ({
        date: date,
        hasTimes: !!daysWithTimes.find(dateWithTimes => dateWithTimes === date.format(DATE_ISO_FORMAT))
      }))
    });

    return ctx.dispatch(new ReadTimes(action.date));
  }

  @Action(MoveMonth)
  moveMonth(ctx: StateContext<CalendarStateModel & { times: TimesStateModel }>, action: MoveMonth) {
    const moveTo = moment(ctx.getState().times.date).add(action.change, 'months');
    return ctx.dispatch(new SelectDate(moveTo));
  }
}
