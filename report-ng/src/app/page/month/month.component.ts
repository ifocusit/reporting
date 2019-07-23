import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { WorkingDateReporting, DEFAULT_DAY_DURATION, WEEK_OVERTIME_MAJOR } from '../../model/working-date-reporting.model';
import { ActivatedRoute } from '@angular/router';
import { filter, groupBy, mergeMap, switchMap, tap, toArray, take, merge, map, pairwise } from 'rxjs/operators';
import { from, of, range, Observable, combineLatest } from 'rxjs';
import { MatDialog } from '@angular/material';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { Time, ISO_DATE_TIME, ISO_MONTH } from '../../model/time.model';
import { TimesService } from 'src/app/service/times.service';
import * as _ from 'lodash';
import { TimesState, SelectDate } from 'src/app/store/month.store';
import { Select, Store } from '@ngxs/store';
import { User } from 'src/app/model/user.model';
import { ProfileService } from 'src/app/service/profile.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.less']
})
export class MonthComponent implements OnInit {
  @Select(TimesState.selectedDate)
  public selectedDate$: Observable<Moment>;

  items$: Observable<WorkingDateReporting[]>;
  private days$: Observable<WorkingDateReporting[]>;
  private times$: Observable<Time[]>;

  public user$: Observable<User>;

  public workDays$: Observable<number>;
  public total$: Observable<number>;
  public overtime$: Observable<number>;
  public finalTotal$: Observable<number>;
  public maxMonthHours$: Observable<number>;

  constructor(
    private route: ActivatedRoute,
    private timesService: TimesService,
    public dialog: MatDialog,
    private profileSevice: ProfileService,
    private authService: AuthService,
    private store: Store
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectMonth(moment(params['month'], 'YYYY-MM'));
    });
    this.user$ = this.profileSevice.user$;

    this.days$ = this.selectedDate$.pipe(
      map(month => _.range(month.daysInMonth()).map((index: number) => new WorkingDateReporting(month.clone().date(index + 1))))
    );

    this.maxMonthHours$ = this.days$.pipe(map(days => days.filter(day => !day.isWeekend).length * DEFAULT_DAY_DURATION));

    this.times$ = this.selectedDate$.pipe(mergeMap(month => this.timesService.read(month.format(ISO_MONTH))));

    this.items$ = combineLatest(this.days$, this.times$).pipe(
      map((pair: [WorkingDateReporting[], Time[]]) =>
        pair[0].map(day => new WorkingDateReporting(day.date, pair[1].filter(time => day.isSameDate(time.date))))
      ),
      tap(days =>
        // extrait tous les jours avant le dernier travaillé
        // de sorte que tout ce qui se trouve avant le dernier jour travaillé
        // et sans heures reportées est compris comme étant un jour de congé
        days
          .slice(
            0,
            days.indexOf(
              days
                .filter(day => day.hasTimes)
                .slice(-1)
                .pop()
            )
          )
          .filter(day => !day.isWeekend && !day.hasTimes)
          .forEach(day => (day.holiday = true))
      )
    );

    // jour travaillé
    this.workDays$ = this.items$.pipe(map(items => items.filter(item => item.hasTimes).length));

    // durée totale
    this.total$ = this.items$.pipe(map(days => days.map(report => report.duration.asHours()).reduce((d1, d2) => d1 + d2)));

    this.overtime$ = combineLatest(this.total$, this.workDays$).pipe(
      map((pair: [number, number]) => pair[0] - DEFAULT_DAY_DURATION * pair[1])
    );

    this.finalTotal$ = combineLatest(this.overtime$, this.total$).pipe(
      map((pair: [number, number]) => Math.max(pair[0], 0) * WEEK_OVERTIME_MAJOR + pair[1])
    );
  }

  public selectMonth(date: Moment) {
    return this.store.dispatch(new SelectDate(date));
  }

  public billing(): void {
    console.log('billing');
  }

  public initMissingDays(): void {
    this.items$
      .pipe(
        mergeMap(days => from(days)),
        filter(day => !day.isWeekend && !day.hasTimes),
        take(1),
        map(day => {
          const date = day.date.clone();
          return [
            new Time(date.set({ hour: 8, minute: 0 }).format(ISO_DATE_TIME)),
            new Time(date.set({ hour: 11, minute: 30 }).format(ISO_DATE_TIME)),
            new Time(date.set({ hour: 12, minute: 30 }).format(ISO_DATE_TIME)),
            new Time(date.set({ hour: 17, minute: 0 }).format(ISO_DATE_TIME))
          ];
        }),
        mergeMap(times => from(times)),
        tap(time => console.log(`creating ${time.getDateTime()}...`)),
        // mergeMap(time => this.timesService.create(time)),
        tap(time => console.log(`${time.getDateTime()} created.`))
        // toArray(),
        // tap(times => console.log(`${times.length} days initialized !`))
      )
      .subscribe();
  }

  edit(toEdit: WorkingDateReporting): void {
    const dialogRef = this.dialog.open(DailyReportComponent, {
      width: '350px',
      data: {
        date: toEdit.date,
        times: [...toEdit.times]
      }
    });
  }

  signOut() {
    this.authService.signOutUser();
  }
}
