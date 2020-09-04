import { Injectable } from '@angular/core';
import { Action, Actions, ofActionDispatched, Selector, State, StateContext, Store } from '@ngxs/store';
import * as moment from 'moment';
import { Moment } from 'moment';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { SettingsReaded, SettingsState } from '../settings';
import { SelectDate } from '../times';
import { HolidaysService } from './holidays.service';

export interface HolidaysStateModel {
  country?: string;
  holidays: string[];
}

export class SetHolidays {
  static readonly type = '[Holidays] SetHolidays]';
  constructor(public readonly country: string, public readonly holidays: string[]) {}
}

@State<HolidaysStateModel>({
  name: 'holidays',
  defaults: {
    holidays: []
  }
})
@Injectable()
export class HolidaysState {
  @Selector()
  public static holidays(state: HolidaysStateModel): string[] {
    return state.holidays ? state.holidays : [];
  }
  @Selector()
  public static state(state: HolidaysStateModel): HolidaysStateModel {
    return state;
  }

  constructor(private readonly store: Store, private readonly actions$: Actions, private readonly holidaysService: HolidaysService) {
    actions$.pipe(ofActionDispatched(SelectDate)).subscribe(({ date }) => this.fromDate(date));
    actions$.pipe(ofActionDispatched(SettingsReaded)).subscribe(({ settings }) => this.fromSettings(settings.project.holidays));
  }

  getYear(date: Moment | string | string[] | undefined): number | undefined {
    date = Array.isArray(date) && date.length > 0 ? date[0] : Array.isArray(date) ? undefined : date;
    return date ? moment(date).year() : undefined;
  }

  fromDate(date: Moment | string): void {
    const selectedDate = moment(date);
    this.store
      .selectOnce(HolidaysState.holidays)
      .pipe(
        filter(holidays => !this.getYear(holidays) || this.getYear(holidays) !== selectedDate.year()),
        mergeMap(() => this.store.selectOnce(SettingsState.settings)),
        map(settings => settings.project.holidays),
        filter(settings => !!settings),
        mergeMap(settings =>
          this.holidaysService
            .holidays$(settings.country, selectedDate.year(), settings.region)
            .pipe(tap(holidays => this.store.dispatch(new SetHolidays(settings.country, holidays))))
        )
      )
      .toPromise();
  }

  fromSettings(settings: { country: string; region?: string }): void {
    this.store
      .selectOnce(HolidaysState.state)
      .pipe(
        filter(
          state => this.getYear(state.holidays) && (!state.holidays || state.holidays.length === 0 || state.country !== settings.country)
        ),
        mergeMap(state => this.holidaysService.holidays$(settings.country, this.getYear(state.holidays), settings.region)),
        tap(holidays => this.store.dispatch(new SetHolidays(settings.country, holidays)))
      )
      .toPromise();
  }

  @Action(SetHolidays)
  setHolidays(ctx: StateContext<HolidaysStateModel>, { country, holidays }: SetHolidays) {
    ctx.setState({ country, holidays });
  }
}
