import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Moment, Duration } from 'moment';
import { ISO_DATE_TIME, Time, ISO_TIME } from '../../../model/time.model';
import { Store } from '@ngxs/store';
import { DeleteTime, AddTime, UpdateTime, AddTimes } from 'src/app/store/month.store';
import { Observable } from 'rxjs';
import { TimesService } from 'src/app/service/times.service';
import { take, map, mergeMap } from 'rxjs/operators';
import { CalculateDuration } from 'src/app/service/calculate-duration.tools';
import { ProjectService } from 'src/app/service/project.service';
import { ProjectState } from 'src/app/store/project.store';
import * as moment from 'moment';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.less']
})
export class DailyReportComponent implements OnInit {
  public times$: Observable<Time[]>;
  public duration$: Observable<Duration>;

  private defaultTimes$ = () =>
    this.store.select(ProjectState.project).pipe(
      mergeMap(project => this.projectService.readSettings(project)),
      map(settings => settings.timbrage.defaults.map(time => moment(time, ISO_TIME)))
    )

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

  addAll() {
    this.defaultTimes$()
      .pipe(
        map(times =>
          times.map(
            time =>
              new Time(
                moment(this.workDay.date)
                  .startOf('day')
                  .set({ hour: time.hour(), minute: time.minute() })
                  .format(ISO_DATE_TIME)
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
        mergeMap(time => this.store.dispatch(new AddTime(new Time(time.format(ISO_DATE_TIME)))))
      )
      .subscribe();
  }

  remove(time: Time): void {
    this.store.dispatch(new DeleteTime(time));
  }

  update(time: Time): void {
    this.store.dispatch(new UpdateTime(time));
  }
}
