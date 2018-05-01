import {Component, OnInit} from '@angular/core';
import {Moment} from 'moment';
import {ISO_DATE, WorkingDateReporting} from '../../model/working-date-reporting.model';
import {ActivatedRoute} from '@angular/router';
import {TimeClient} from "../../client/time-client.service";
import {filter, groupBy, map, mergeMap, switchMap, tap, toArray} from "rxjs/operators";
import {from} from "rxjs/observable/from";
import {MatDialog} from "@angular/material";
import {DailyReportComponent} from "./daily-report/daily-report.component";
import {Time} from "../../model/time.model";
import moment = require('moment');

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.less']
})
export class MonthComponent implements OnInit {

  public DEFAULT_DAY_DURATION: number = 8;
  public WEEK_OVERTIME_MAJOR: number = 1.2;

  _month: Moment;
  items: Array<WorkingDateReporting>;

  constructor(private route: ActivatedRoute, private timeClient: TimeClient, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.month = moment(params['month'], 'YYYY-MM');
    });
  }

  private initDays(): void {
    this.items = [];
    for (let i = 1; i <= this._month.daysInMonth(); i++) {
      this.items.push(new WorkingDateReporting(this._month.clone().day(i)));
    }
    this.timeClient.getTimes$(this._month.format('YYYY-MM'))
      .pipe(
        switchMap(times => from(times)),
        groupBy(time => moment(time.time).format(ISO_DATE)),
        mergeMap(group$ => group$.pipe(toArray())),
        map(groupTimes => WorkingDateReporting.from(groupTimes)),
        tap(reportItem => this.items.push(reportItem))
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
    const items = this.items
      .filter(report => report.duration);

    if (items.length == 0) {
      return 0;
    }
    return items.map(report => report.getDuration().asHours())
      .reduce((d1, d2) => d1 + d2);
  }

  get overtime(): number {
    return this.total - this.DEFAULT_DAY_DURATION * this.workDays;
  }

  get finalTotal(): number {
    return this.DEFAULT_DAY_DURATION * this.workDays + this.overtime * this.WEEK_OVERTIME_MAJOR;
  }

  public billing(): void {
    console.log("billing");
  }

  edit(toEdit: WorkingDateReporting): void {
    let dialogRef = this.dialog.open(DailyReportComponent, {
      width: '300px',
    ***REMOVED*** {
        date: toEdit.date,
        times: !toEdit.times ? [] : toEdit.times.map((time) => time.clone())
      }
    });

    const olds$ = from(toEdit.times);

    dialogRef.afterClosed().pipe(
      filter(validated => validated),
      map(report => report.times),
      switchMap(times => from(times)),
      switchMap((time: Time) => {
        return this.timeClient.create$(time.time);
      }),
      mergeMap((times) => {
        return times;
      })
    )
      .subscribe((newTimes) => olds$.pipe(
        filter((time) => time.id),
        switchMap((time) => {
          return this.timeClient.delete$(time);
        }),
      )
        .subscribe(() => toEdit.times = newTimes));
  }
}
