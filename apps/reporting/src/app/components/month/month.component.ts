import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthService,
  DATETIME_ISO_FORMAT,
  MONTH_ISO_FORMAT,
  SelectDate,
  Settings,
  SettingsState,
  Time,
  TimeAdapter,
  TimesService,
  TimesState,
  User,
  WorkingDateReporting
} from '@ifocusit/commons';
import { Select, Store } from '@ngxs/store';
import range from 'lodash/range';
import * as moment from 'moment';
import { Duration, Moment } from 'moment';
import { combineLatest, from, Observable } from 'rxjs';
import { filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { ExportService } from './../../../../../../libs/commons/src/lib/times/export.service';
import { DailyReportComponent } from './daily-report/daily-report.component';

@Component({
  selector: 'ifocusit-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss']
})
export class MonthComponent implements OnInit {
  @Select(SettingsState.project)
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
    private router: Router,
    private exportService: ExportService
  ) {}

  ngOnInit() {
    this.route.params.pipe(mergeMap(params => this.store.dispatch(new SelectDate(moment(params.month, 'YYYY-MM'))))).subscribe();

    this.user$ = this.profileSevice.user$;

    this.days$ = this.selectedDate$.pipe(
      map(date => range(date.daysInMonth()).map(index => new WorkingDateReporting(date.clone().day(index + 1))))
    );

    this.times$ = this.selectedDate$.pipe(mergeMap(month => this.timesService.read(month, 'month')));

    this.items$ = combineLatest([this.days$, this.times$]).pipe(
      map(pair =>
        pair[0].map(
          day =>
            new WorkingDateReporting(
              day.date,
              pair[1].filter(time => day.isSameDate(new TimeAdapter(time).getDay()))
            )
        )
      )
    );

    // jours travaillés
    this.workDays$ = this.items$.pipe(map(days => days.filter(day => !day.isHoliday && !day.isWeekend).length));

    // heures demandées
    this.mustHours$ = combineLatest([this.workDays$, this.settings$]).pipe(map(pair => pair[0] * pair[1].timbrage.dailyReport));

    // durée totale
    this.total$ = this.items$.pipe(map(days => days.map(report => report.duration).reduce((d1, d2) => d1.add(d2))));

    this.overtime$ = combineLatest([this.total$, this.mustHours$]).pipe(
      map(pair => pair[0].clone().subtract(moment.duration(pair[1], 'hours')))
    );

    this.finalTotal$ = combineLatest([this.overtime$, this.total$]).pipe(
      mergeMap(pair =>
        this.settings$.pipe(map(settings => pair[1].clone().add(Math.max(pair[0].asHours(), 0) * settings.timbrage.overtimeRate, 'hours')))
      )
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

  exportMonth() {
    this.selectedDate$
      .pipe(
        take(1),
        tap(date => this.exportService.exportMonth(date))
      )
      .subscribe();
  }
}
