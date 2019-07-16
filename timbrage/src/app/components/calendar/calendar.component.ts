import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import * as moment from 'moment';
import { Duration, Moment } from 'moment';
import { Time, TimeAdapter, MONTH_ISO_FORMAT, DATE_ISO_FORMAT } from '../../models/time.model';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { CalculationService } from '../../services/calculation.service';
import { TimesService } from 'src/app/services/times.service';
import { Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { TimesState, MoveMonth, SelectDate } from 'src/app/store/time.store';

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
  constructor(private calculationService: CalculationService, private timesService: TimesService, private store: Store) {}
  public weekDays = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];

  public month$: Observable<Time[]>;
  public times$: Observable<Time[]>;
  @Select(TimesState.selectedDate)
  public selectedDate$: Observable<Moment>;
  public days$: Observable<CalendarDayModel[]>;

  sumDay$: Observable<Duration>;

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
    this.month$ = this.selectedDate$.pipe(mergeMap(date => this.timesService.read(date.format(MONTH_ISO_FORMAT))));
    this.times$ = combineLatest(this.selectedDate$, this.month$).pipe(
      map(pair => pair[1].filter(time => time.time.startsWith(pair[0].format(DATE_ISO_FORMAT))))
    );
    this.sumDay$ = this.times$.pipe(map(times => this.calculationService.calculate(times, false)));
    this.days$ = combineLatest(this.selectedDate$, this.month$).pipe(
      map(pair => [CalendarComponent.getMonthDays(pair[0]), pair[1]]),
      map((pair: [Moment[], Time[]]) =>
        pair[0].map(day => ({
          date: day,
          hasTimes: !!pair[1].find(time => time.time.startsWith(day.format(DATE_ISO_FORMAT)))
        }))
      )
    );

    this.select(moment());
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
        mergeMap(time => this.timesService.create(TimeAdapter.createTime(time)))
      )
      .subscribe();
  }
}
