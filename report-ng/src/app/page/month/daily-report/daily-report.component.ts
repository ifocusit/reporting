import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Moment, Duration } from 'moment';
import { DEFAULT_TIME, CalculateDuration } from '../../../model/working-date-reporting.model';
import { ISO_DATE_TIME, Time } from '../../../model/time.model';
import { Store } from '@ngxs/store';
import { DeleteTime, AddTime, UpdateTime } from 'src/app/store/month.store';
import { Observable } from 'rxjs';
import { TimesService } from 'src/app/client/time-client.service';
import { take, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.less']
})
export class DailyReportComponent implements OnInit {
  public times$: Observable<Time[]>;
  public duration$: Observable<Duration>;

  constructor(
    public dialogRef: MatDialogRef<DailyReportComponent>,
    @Inject(MAT_DIALOG_DATA) public workDay: { date: Moment },
    private store: Store,
    private timesService: TimesService
  ) {}

  ngOnInit() {
    this.times$ = this.timesService.read(this.workDay.date);
    this.duration$ = this.times$.pipe(map(times => CalculateDuration(times)));
  }

  close(): void {
    this.dialogRef.close();
  }

  add(): void {
    this.times$
      .pipe(
        map(times => Math.min(times.length, 3)),
        take(1),
        map(index => DEFAULT_TIME.getDatetime(index)),
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
