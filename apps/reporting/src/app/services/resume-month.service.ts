import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BillService, Settings, SettingsState, TimeAdapter, TimesService, UserService, WorkingDateReporting } from '@ifocusit/commons';
import { Store } from '@ngxs/store';
import { range } from 'lodash';
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
  constructor(
    private timesService: TimesService,
    private billService: BillService,
    private store: Store,
    private firestore: AngularFirestore,
    private userService: UserService
  ) {}

  public resume$(month: string): Observable<MonthProgression> {
    const currentMonth = moment(month);

    return this.billService.getBill$(month).pipe(
      mergeMap(bill => {
        if (bill.archived && bill.detail) {
          return of({
            nbWorkDays: bill.detail.nbWorkDays,
            mustDuration: moment.duration(bill.detail.mustWorkDuration),
            total: moment.duration(bill.detail.timeWorkDuration),
            overtime: moment.duration(bill.detail.overtimeCalculateDuration),
            percent: bill.detail.percentProgression
          });
        }
        return this.timesService.read(month, 'month').pipe(
          map(times =>
            range(currentMonth.daysInMonth())
              .map(index => new WorkingDateReporting(currentMonth.clone().date(index + 1)))
              .map(
                day =>
                  new WorkingDateReporting(
                    day.date,
                    times.filter(time => day.isSameDate(new TimeAdapter(time).getDay()))
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
    return days.filter(day => !day.isHoliday && !day.isWeekend).length;
  }
}
