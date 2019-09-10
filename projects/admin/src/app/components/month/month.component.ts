import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment, Duration } from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, mergeMap, tap, take, map } from 'rxjs/operators';
import { from, Observable, combineLatest } from 'rxjs';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { Select, Store } from '@ngxs/store';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { ProjectState } from 'projects/commons/src/lib/settings/project.store';
import { TimesState, SelectDate } from 'projects/commons/src/lib/times/time.store';
import {
  WorkingDateReporting,
  DEFAULT_DAY_DURATION,
  WEEK_OVERTIME_MAJOR
} from 'projects/commons/src/lib/times/working-date-reporting.model';
import { Time, MONTH_ISO_FORMAT, DATETIME_ISO_FORMAT, TimeAdapter } from 'projects/commons/src/lib/times/time.model';
import { User } from 'projects/commons/src/lib/auth/user/user.model';
import { TimesService } from 'projects/commons/src/lib/times/times.service';
import { AuthService } from 'projects/commons/src/lib/auth/auth.service';
import { Settings } from 'projects/commons/src/lib/settings/settings.model';
import { SettingsState } from 'projects/commons/src/lib/settings/settings.store';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss']
})
export class MonthComponent implements OnInit {
  @Select(ProjectState.project)
  public project$: Observable<string>;
  @Select(SettingsState.settings)
  public settings$: Observable<Settings>;

  @Select(TimesState.selectedDate)
  public selectedDate$: Observable<Moment>;

  public items$: Observable<WorkingDateReporting[]>;
  private days$: Observable<WorkingDateReporting[]>;
  private times$: Observable<Time[]>;

  public user$: Observable<User>;

  public workDays$: Observable<number>;
  public total$: Observable<Duration>;
  public overtime$: Observable<Duration>;
  public finalTotal$: Observable<Duration>;
  public mustHours$: Observable<number>;

  private totalsAsDecimal = false;

  constructor(
    private route: ActivatedRoute,
    private timesService: TimesService,
    public dialog: MatDialog,
    private profileSevice: AuthService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.pipe(mergeMap(params => this.store.dispatch(new SelectDate(moment(params.month, 'YYYY-MM'))))).subscribe();

    this.user$ = this.profileSevice.user$;

    this.days$ = this.selectedDate$.pipe(
      map(date => _.range(date.daysInMonth()).map(index => new WorkingDateReporting(date.clone().date(index + 1))))
    );

    this.times$ = combineLatest(this.project$, this.selectedDate$).pipe(
      map(pair => pair[1]),
      mergeMap(month => this.timesService.read(month, 'month'))
    );

    this.items$ = combineLatest(this.days$, this.times$).pipe(
      map(pair =>
        pair[0].map(day => new WorkingDateReporting(day.date, pair[1].filter(time => day.isSameDate(new TimeAdapter(time).getDay()))))
      )
    );

    // jours travaillés
    this.workDays$ = this.items$.pipe(map(days => days.filter(day => !day.isHoliday && !day.isWeekend).length));

    // jours ouvrés
    // const openDays$ = this.days$.pipe(map(days => days.filter(day => !day.isWeekend).length));

    // heures demandées
    this.mustHours$ = this.workDays$.pipe(map(days => days * DEFAULT_DAY_DURATION));

    // durée totale
    this.total$ = this.items$.pipe(map(days => days.map(report => report.duration).reduce((d1, d2) => d1.add(d2))));

    this.overtime$ = combineLatest(this.total$, this.mustHours$).pipe(
      map(pair => pair[0].clone().subtract(moment.duration(pair[1], 'hours')))
    );

    this.finalTotal$ = combineLatest(this.overtime$, this.total$).pipe(
      map(pair => pair[1].clone().add(Math.max(pair[0].asHours(), 0) * WEEK_OVERTIME_MAJOR, 'hours'))
    );
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
            TimeAdapter.createTime(date.set({ hour: 8, minute: 0 }).format(DATETIME_ISO_FORMAT)),
            TimeAdapter.createTime(date.set({ hour: 11, minute: 30 }).format(DATETIME_ISO_FORMAT)),
            TimeAdapter.createTime(date.set({ hour: 12, minute: 30 }).format(DATETIME_ISO_FORMAT)),
            TimeAdapter.createTime(date.set({ hour: 17, minute: 0 }).format(DATETIME_ISO_FORMAT))
          ];
        }),
        mergeMap(times => from(times))
      )
      .subscribe();
  }

  edit(toEdit: WorkingDateReporting): void {
    this.dialog.open(DailyReportComponent, {
      width: '350px',
      data: {
        date: toEdit.date,
        times: [...toEdit.times]
      }
    });
  }

  changeMonth(navigation: number) {
    this.store
      .selectOnce(TimesState.selectedDate)
      .subscribe(date => this.router.navigate(['/month', date.add(navigation, 'month').format(MONTH_ISO_FORMAT)], { replaceUrl: true }));
  }

  public toggleTotalsFormat() {
    this.totalsAsDecimal = !this.totalsAsDecimal;
  }

  public get totalsFormat() {
    return this.totalsAsDecimal ? 'hours' : null;
  }
}
