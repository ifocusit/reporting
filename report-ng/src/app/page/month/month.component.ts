import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { WorkingDateReporting } from '../../model/working-date-reporting.model';
import { ActivatedRoute } from '@angular/router';
import { filter, groupBy, mergeMap, switchMap, tap, toArray, take, merge, map, pairwise } from 'rxjs/operators';
import { from, of, range, Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { Time } from '../../model/time.model';
import { TimesService } from 'src/app/client/time-client.service';
import { AuthService, User } from '../auth/auth.service';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.less']
})
export class MonthComponent implements OnInit {
  public DEFAULT_DAY_DURATION = 8;
  public WEEK_OVERTIME_MAJOR = 1.2;

  _month: Moment;
  items: Array<WorkingDateReporting>;

  public user$: Observable<User>;

  constructor(
    private route: ActivatedRoute,
    private timesService: TimesService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.month = moment(params['month'], 'YYYY-MM');
    });
    this.user$ = this.authService.user$;
  }

  private initDays(): void {
    this.items = [];
    for (let i = 1; i <= this._month.daysInMonth(); i++) {
      this.items.push(new WorkingDateReporting(this._month.clone().date(i)));
    }
    this.timesService
      .read(this._month.format('YYYY-MM'))
      .pipe(
        mergeMap(times => from(times)),
        tap(time => {
          const item = this.items.find(day => day.isSameDate(time.getDate()));
          if (item) {
            item.times.push(time);
          }
        })
        // groupBy((time: Time) => {
        //   return time.getDate();
        // }),
        // mergeMap(group$ => {
        //   return group$.pipe(toArray());
        // }),
        // tap((groupTimes: Time[]) => {
        //   const date = groupTimes[0].getDate();
        //   const item = this.items.find(day => day.isSameDate(date));
        //   if (item) {
        //     item.times = groupTimes.sort();
        //   }
        // })
      )
      .subscribe();
  }

  get month(): Moment {
    return this._month;
  }

  set month(date: Moment) {
    this._month = date.date(1);
    if (this._month) {
      this.initDays();
    }
  }

  get workDays(): number {
    return this.items.filter(item => item.duration).length;
  }

  get total(): number {
    const items = this.items.filter(report => report.duration);

    if (items.length === 0) {
      return 0;
    }
    return items.map(report => report.getDuration().asHours()).reduce((d1, d2) => d1 + d2);
  }

  get overtime(): number {
    return this.total - this.DEFAULT_DAY_DURATION * this.workDays;
  }

  get finalTotal(): number {
    return this.DEFAULT_DAY_DURATION * this.workDays + this.overtime * this.WEEK_OVERTIME_MAJOR;
  }

  public billing(): void {
    console.log('billing');
  }

  public initMissingDays(): void {
    from(this.items)
      .pipe(
        filter(day => !day.isWeekend() && (!day.times || day.times.length === 0)),
        tap(day => day.setDefaultTimes()),
        mergeMap(day => from(day.times)),
        tap(time => console.log(`creating ${time.getDateTime()}...`)),
        mergeMap(time => this.timesService.create(time)),
        tap(time => console.log(`${time.getDateTime()} created.`)),
        toArray(),
        tap(times => console.log(`${times.length} days initialized !`))
      )
      .subscribe()
      .unsubscribe();
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
