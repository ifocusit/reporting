import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import {
  Bill,
  BillService,
  CalculationService,
  Settings,
  SettingsState,
  TimeAdapter,
  TimesService,
  WorkingDateReporting
} from '@ifocusit/commons';
import { Select } from '@ngxs/store';
import { range } from 'lodash';
import * as moment from 'moment';
import { Duration } from 'moment';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

interface Progression {
  nbWorkDays: number;
  mustDuration: Duration;
  total: Duration;
  overtime: Duration;
  percent: number;
}

@Component({
  selector: 'ifocusit-month-card',
  templateUrl: './month-card.component.html',
  styleUrls: ['./month-card.component.scss'],
  animations: [
    trigger('showPdfIcon', [transition(':enter', [style({ transform: 'scale(0)' }), animate('500ms', style({ transform: 'scale(1)' }))])]),
    trigger('showHours', [transition(':enter', [style({ opacity: 0 }), animate('500ms', style({ opacity: 1 }))])]),
    trigger('showProgressBar', [transition(':enter', [style({ width: 0 }), animate('500ms', style({ width: '100%' }))])]),
    trigger('showCard', [transition(':enter', [style({ transform: 'scale(0)' }), animate('500ms', style({ transform: 'scale(1)' }))])])
  ]
})
export class MonthCardComponent implements OnInit {
  @Input()
  month: string;

  @Select(SettingsState.settings)
  public settings$: Observable<Settings>;

  public today = moment().format('YYYY-MM');

  progression$: Observable<Progression>;
  bill$: Observable<Bill>;

  constructor(private timesService: TimesService, private calculationService: CalculationService, private billService: BillService) {}

  ngOnInit(): void {
    this.bill$ = this.billService.getBill$(this.month);

    const currentMonth = moment(this.month);

    this.progression$ = this.timesService.read(this.month, 'month').pipe(
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
        this.settings$.pipe(
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
