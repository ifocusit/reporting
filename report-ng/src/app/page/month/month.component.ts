import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { WorkingDateReporting } from '../../model/working-date-reporting.model';
import { ActivatedRoute } from '@angular/router';
import { filter, groupBy, mergeMap, switchMap, tap, toArray, take, merge, map, pairwise } from 'rxjs/operators';
import { from, of, range, Observable, combineLatest } from 'rxjs';
import { MatDialog } from '@angular/material';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { Time, ISO_DATE_TIME, ISO_MONTH } from '../../model/time.model';
import { TimesService } from 'src/app/client/time-client.service';
import { AuthService, User } from '../auth/auth.service';
import * as _ from 'lodash';
import { TimesState, SelectDate } from 'src/app/store/month.store';
import { Select, Store } from '@ngxs/store';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.less']
})
export class MonthComponent implements OnInit {
  public DEFAULT_DAY_DURATION = 8;
  public WEEK_OVERTIME_MAJOR = 1.2;

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

  constructor(
    private route: ActivatedRoute,
    private timesService: TimesService,
    public dialog: MatDialog,
    private authService: AuthService,
    private store: Store
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectMonth(moment(params['month'], 'YYYY-MM'));
    });
    this.user$ = this.authService.user$;

    this.days$ = this.selectedDate$.pipe(
      map(month => _.range(month.daysInMonth()).map((index: number) => new WorkingDateReporting(month.clone().date(index + 1))))
    );

    this.times$ = this.selectedDate$.pipe(mergeMap(month => this.timesService.read(month.format(ISO_MONTH))));

    this.items$ = combineLatest(this.days$, this.times$).pipe(
      map((pair: [WorkingDateReporting[], Time[]]) =>
        pair[0].map(day => new WorkingDateReporting(day.date, pair[1].filter(time => day.isSameDate(time.date))))
      )
    );

    this.workDays$ = this.items$.pipe(map(items => items.filter(item => item.duration).length));
    this.total$ = this.items$.pipe(
      map(days => {
        const items = days.filter(report => report.duration);
        if (items.length === 0) {
          return 0;
        }
        return items.map(report => report.getDuration().asHours()).reduce((d1, d2) => d1 + d2);
      })
    );
    this.overtime$ = combineLatest(this.total$, this.workDays$).pipe(
      map((pair: [number, number]) => pair[0] - this.DEFAULT_DAY_DURATION * pair[1])
    );
    this.overtime$ = combineLatest(this.overtime$, this.workDays$).pipe(
      map((pair: [number, number]) => pair[0] * this.WEEK_OVERTIME_MAJOR + this.DEFAULT_DAY_DURATION * pair[1])
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
        filter(day => !day.isWeekend() && (!day.times || day.times.length === 0)),
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
      width: '300px',
      data: {
        date: toEdit.date,
        times: !toEdit.times ? [] : toEdit.times.map(time => time.clone())
      }
    });

    const deleteOlds$ = from(Array.from(toEdit.times)).pipe(
      filter(time => time.hasId()),
      mergeMap(toDelete => this.timesService.delete(toDelete))
    );

    const createNews$ = times =>
      from(times).pipe(
        mergeMap((time: Time) => this.timesService.create(time)),
        toArray()
      );

    dialogRef
      .afterClosed()
      .pipe(
        filter(x => !!x),
        switchMap(report => createNews$(report.times)),
        tap(times => (toEdit.times = times)),
        switchMap(() => deleteOlds$)
      )
      .subscribe();
  }

  signOut() {
    this.authService.signOutUser();
  }
}
