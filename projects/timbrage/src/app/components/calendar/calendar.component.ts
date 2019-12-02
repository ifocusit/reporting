import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import * as moment from 'moment';
import { Duration, Moment } from 'moment';
import { SettingsState } from 'projects/commons/src/lib/settings/settings.store';
import { CalculationService } from 'projects/commons/src/lib/times/calculation.service';
import { DATE_ISO_FORMAT, Time, TimeAdapter } from 'projects/commons/src/lib/times/time.model';
import { AddTime, AddTimes, MoveMonth, SelectDate, TimesState } from 'projects/commons/src/lib/times/time.store';
import { TimesService } from 'projects/commons/src/lib/times/times.service';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { map, mergeMap, take } from 'rxjs/operators';

export interface CalendarDayModel {
  date: Moment;
  hasTimes: boolean;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  public weekDays = [];

  @Select(SettingsState.project)
  public project$: Observable<string>; // projet sélectionné

  @Select(TimesState.selectedDate)
  public selectedDate$: Observable<Moment>; // jour sélectionné

  public month$: Observable<Time[]>; // timbrages du mois
  public times$: Observable<Time[]>; // timbrages du jour
  public days$: Observable<CalendarDayModel[]>; // jours dispo dans le mois

  sumDay$: Observable<Duration>;

  constructor(
    private calculationService: CalculationService,
    private timesService: TimesService,
    private store: Store,
    private router: Router,
    private translate: TranslateService
  ) {}

  private static getMonthDays(selectedDate: Moment): Moment[] {
    const days = [];
    let date = moment(selectedDate)
      .date(1)
      .startOf('day');
    while (date.days() !== 0) {
      date.add(-1, 'days');
      days.unshift(moment(date));
    }
    date = moment(selectedDate)
      .date(1)
      .startOf('day');
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

  ngOnInit() {
    this.translate
      .get('calendar.weekDays')
      .pipe(map(value => value.split(',')))
      .subscribe(days => (this.weekDays = days));

    this.month$ = combineLatest([this.project$, this.selectedDate$]).pipe(mergeMap(pair => this.timesService.read(pair[1], 'month')));

    this.times$ = combineLatest([this.selectedDate$, this.month$]).pipe(
      map(pair => pair[1].filter(time => time.time.startsWith(pair[0].format(DATE_ISO_FORMAT))))
    );

    this.sumDay$ = this.times$.pipe(mergeMap(times => this.calculationService.calculate(times, false)));

    this.days$ = combineLatest([this.selectedDate$, this.month$]).pipe(
      map(pair => [CalendarComponent.getMonthDays(pair[0]), pair[1]]),
      map((pair: [Moment[], Time[]]) =>
        pair[0].map(day => ({
          date: day,
          hasTimes: !!pair[1].find(time => time.time.startsWith(day.format(DATE_ISO_FORMAT)))
        }))
      )
    );

    this.select(moment()); // charge le jour en cours par défaut
  }

  ngOnDestroy() {}

  public changeMonth(change: number) {
    this.store.dispatch(new MoveMonth(change));
  }

  public select(date: Moment) {
    this.store.dispatch(new SelectDate(date));
  }

  public addTimbrage() {
    this.selectedDate$
      .pipe(
        take(1),
        map(selected =>
          moment()
            .date(selected.date())
            .month(selected.month())
            .year(selected.year())
        ),
        mergeMap(time => this.store.dispatch(new AddTime(TimeAdapter.createTime(time))))
      )
      .subscribe();
  }

  public addTimbrages() {
    this.selectedDate$
      .pipe(
        take(1),
        mergeMap(date =>
          this.store.selectOnce(SettingsState.settings).pipe(
            map(settings =>
              settings.timbrage.defaults
                .map(time => moment(time, 'HH.mm'))
                .map(time =>
                  moment(date)
                    .startOf('day')
                    .set({ hour: time.hour(), minute: time.minute() })
                )
                .map(time => TimeAdapter.createTime(time))
            ),
            mergeMap(times => this.store.dispatch(new AddTimes(times)))
          )
        )
      )
      .subscribe();
  }

  public openTimbrage() {
    this.router.navigate(['/timbrage'], { replaceUrl: true });
  }
}
