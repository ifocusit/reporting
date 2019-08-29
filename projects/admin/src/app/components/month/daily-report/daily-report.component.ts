import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Moment, Duration } from 'moment';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take, map, mergeMap } from 'rxjs/operators';
import * as moment from 'moment';
import { Time, TimeAdapter, TIME_ISO_FORMAT, DATETIME_ISO_FORMAT } from 'projects/commons/src/lib/times/time.model';
import { ProjectState } from 'projects/commons/src/lib/settings/project.store';
import { TimesService } from 'projects/commons/src/lib/times/times.service';
import { ProjectService } from 'projects/commons/src/lib/settings/project.service';
import { CalculateDuration } from 'projects/commons/src/lib/times/calculate-duration.tools';
import { AddTimes, AddTime, DeleteTime, UpdateTime, DeleteTimes } from 'projects/commons/src/lib/times/time.store';
import { SettingsState } from 'projects/commons/src/lib/settings/settings.store';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.scss']
})
export class DailyReportComponent implements OnInit {
  public times$: Observable<Time[]>;
  public duration$: Observable<Duration>;

  private defaultTimes$ = () =>
    this.store.select(SettingsState.settings).pipe(map(settings => settings.timbrage.defaults.map(time => moment(time, TIME_ISO_FORMAT))))

  constructor(
    public dialogRef: MatDialogRef<DailyReportComponent>,
    @Inject(MAT_DIALOG_DATA) public workDay: { date: Moment },
    private store: Store,
    private timesService: TimesService,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.times$ = this.timesService.read(this.workDay.date);
    this.duration$ = this.times$.pipe(map(times => CalculateDuration(times)));
  }

  close(): void {
    this.dialogRef.close();
  }

  empty() {
    const time = TimeAdapter.createTime(
      moment(this.workDay.date)
        .startOf('day')
        .format(DATETIME_ISO_FORMAT)
    );
    this.store.dispatch(new AddTimes([time, time]));
  }

  addAll() {
    this.defaultTimes$()
      .pipe(
        map(times =>
          times.map(time =>
            TimeAdapter.createTime(
              moment(this.workDay.date)
                .startOf('day')
                .set({ hour: time.hour(), minute: time.minute() })
                .format(DATETIME_ISO_FORMAT)
            )
          )
        ),
        mergeMap(times => this.store.dispatch(new AddTimes(times)))
      )
      .subscribe();
  }

  add(): void {
    this.times$
      .pipe(
        map(times => Math.min(times.length, 3)),
        take(1),
        mergeMap(index => this.defaultTimes$().pipe(map(times => times[index]))),
        map(defaultTime =>
          this.workDay.date
            .clone()
            .startOf('day')
            .set({ hour: defaultTime.hour(), minute: defaultTime.minute() })
        ),
        mergeMap(time => this.store.dispatch(new AddTime(TimeAdapter.createTime(time.format(DATETIME_ISO_FORMAT)))))
      )
      .subscribe();
  }

  remove(time: Time): void {
    this.store.dispatch(new DeleteTime(time));
  }

  update(time: Time): void {
    this.store.dispatch(new UpdateTime(time));
  }

  clear() {
    this.times$
      .pipe(
        map(times => this.store.dispatch(new DeleteTimes(times))),
        take(1)
      )
      .subscribe();
  }

  public changeDay(value: number) {
    this.workDay.date = this.workDay.date.clone().add(value, 'day');
    this.ngOnInit();
  }
}
