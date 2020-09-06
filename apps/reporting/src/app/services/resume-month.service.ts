import { Injectable } from '@angular/core';
import { BillService, DATE_ISO_FORMAT, Settings, SettingsState, TimeAdapter, TimesService, WorkingDateReporting } from '@ifocusit/commons';
import { Store } from '@ngxs/store';
import range from 'lodash/range';
import * as moment from 'moment';
import { Duration } from 'moment';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

export interface MonthProgression {
  nbWorkDays: number;
  mustDuration: Duration;
  overtime: Duration;
  total: Duration;
  percent: number;
}

@Injectable({ providedIn: 'root' })
export class ResumeMonthService {
  constructor(private timesService: TimesService, private billService: BillService, private store: Store) {}

  public resume$(month: string): Observable<MonthProgression> {
    const currentMonth = moment(month);

    return this.billService.getBill$(month).pipe(
      mergeMap(bill => {
        if (bill.archived && bill.detail) {
          const mustDuration = moment.duration(bill.detail.mustWorkDuration);
          const total = moment.duration(bill.detail.timeWorkDuration);
          const overtime = this.calculateOvertimeDuration(total, mustDuration);
          return of({
            nbWorkDays: bill.detail.nbWorkDays,
            mustDuration,
            total,
            overtime,
            percent: this.calculateProgression(overtime, total, mustDuration)
          });
        }
        return this.timesService.read(month, 'month').pipe(
          map(times =>
            range(currentMonth.daysInMonth())
              .map(index => currentMonth.clone().date(index + 1))
              .map(
                day =>
                  new WorkingDateReporting(
                    day,
                    times.filter(time => day.format(DATE_ISO_FORMAT) === new TimeAdapter(time).getDay())
                  )
              )
          ),
          mergeMap((days: WorkingDateReporting[]) =>
            this.store.select(SettingsState.settings).pipe(
              map(settings => {
                const nbWorkDays = this.calculateWorkedDays(days);
                const mustDuration = this.calculateMustHours(nbWorkDays, settings);
                const total = this.calculateWorkDuration(days);
                const overtime = this.calculateOvertimeDuration(total, mustDuration);
                const percent = this.calculateProgression(overtime, total, mustDuration);
                return {
                  nbWorkDays,
                  mustDuration,
                  total,
                  overtime,
                  percent
                };
              })
            )
          )
        );
      })
    );
  }

  private calculateProgression(overtime: Duration, total: Duration, mustHours: Duration): number {
    if (mustHours.asHours() === 0) {
      return 0;
    }
    return ((total.asHours() - Math.max(overtime.asHours(), 0)) * 100) / (Math.max(overtime.asHours(), 0) + mustHours.asHours());
  }

  private calculateOvertimeDuration(total: Duration, mustHours: Duration) {
    return total.clone().subtract(mustHours);
  }

  private calculateWorkDuration(days: WorkingDateReporting[]): Duration {
    return days.map(report => report.duration).reduce((d1, d2) => d1.clone().add(d2));
  }

  private calculateMustHours(nbWorkDays: number, settings: Settings): Duration {
    return moment.duration(nbWorkDays * settings.timbrage.dailyReport, 'hours');
  }

  private calculateWorkedDays(days: WorkingDateReporting[]): number {
    return days.filter(day => !day.off).length;
  }
}
