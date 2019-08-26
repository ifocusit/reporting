import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ActivatedRoute } from '@angular/router';
import { filter, mergeMap, tap, take, map } from 'rxjs/operators';
import { from, Observable, combineLatest } from 'rxjs';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { Select, Store } from '@ngxs/store';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { ProjectState } from 'projects/commons/src/lib/settings/project.store';
import { TimesState, SelectDate } from 'projects/commons/src/lib/times/time.store';
import { WorkingDateReporting, DEFAULT_DAY_DURATION, WEEK_OVERTIME_MAJOR } from '../../models/working-date-reporting.model';
import { Time, MONTH_ISO_FORMAT, DATETIME_ISO_FORMAT, TimeAdapter } from 'projects/commons/src/lib/times/time.model';
import { User } from 'projects/commons/src/lib/auth/user.model';
import { TimesService } from 'projects/commons/src/lib/times/times.service';
import { AuthService } from 'projects/commons/src/lib/auth/auth.service';
import { ProjectService } from 'projects/commons/src/lib/settings/project.service';
import { Settings } from 'projects/commons/src/lib/settings/settings.model';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss']
})
export class MonthComponent implements OnInit {
  @Select(ProjectState.project)
  public project$: Observable<any>;

  @Select(TimesState.selectedDate)
  public selectedDate$: Observable<Moment>;

  public items$: Observable<WorkingDateReporting[]>;
  private days$: Observable<WorkingDateReporting[]>;
  private times$: Observable<Time[]>;

  public user$: Observable<User>;
  public settings$: Observable<Settings>;

  public workDays$: Observable<number>;
  public total$: Observable<number>;
  public overtime$: Observable<number>;
  public finalTotal$: Observable<number>;
  public maxMonthHours$: Observable<number>;

  constructor(
    private route: ActivatedRoute,
    private timesService: TimesService,
    public dialog: MatDialog,
    private profileSevice: AuthService,
    private projectService: ProjectService,
    private store: Store
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectMonth(moment(params.month, 'YYYY-MM'));
    });

    this.settings$ = this.project$.pipe(mergeMap(projectName => this.projectService.readSettings(projectName)));

    this.user$ = this.profileSevice.user$;

    this.days$ = this.selectedDate$.pipe(
      map(month => _.range(month.daysInMonth()).map((index: number) => new WorkingDateReporting(month.clone().date(index + 1))))
    );

    this.maxMonthHours$ = this.days$.pipe(map(days => days.filter(day => !day.isWeekend).length * DEFAULT_DAY_DURATION));

    this.times$ = combineLatest(this.project$, this.selectedDate$).pipe(
      map(pair => pair[1]),
      mergeMap(month => this.timesService.read(month.format(MONTH_ISO_FORMAT)))
    );

    this.items$ = combineLatest(this.days$, this.times$).pipe(
      map((pair: [WorkingDateReporting[], Time[]]) =>
        pair[0].map(day => new WorkingDateReporting(day.date, pair[1].filter(time => day.isSameDate(new TimeAdapter(time).getDay()))))
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
        mergeMap(times => from(times)),
        tap(time => console.log(`creating ${new TimeAdapter(time).format()}...`)),
        tap(time => console.log(`${new TimeAdapter(time).format()} created.`))
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
}
