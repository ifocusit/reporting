import {Component, OnInit} from '@angular/core';
import {Moment} from 'moment';
import {WorkingDateReporting} from '../../model/working-date-reporting.model';
import {ActivatedRoute} from '@angular/router';
import {TimeClient} from "../../client/time-client.service";
import {filter, groupBy, mergeMap, switchMap, tap, toArray} from "rxjs/operators";
import {from} from "rxjs/observable/from";
import {MatDialog} from "@angular/material";
import {DailyReportComponent} from "./daily-report/daily-report.component";
import {Time} from "../../model/time.model";
import {of} from "rxjs/observable/of";
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
      this.items.push(new WorkingDateReporting(this._month.clone().date(i)));
    }
    this.timeClient.getTimes$(this._month.format('YYYY-MM'))
      .pipe(
        switchMap(times => from(times)),
        groupBy((time: Time) => {
          return time.getDate();
        }),
        mergeMap(group$ => {
          return group$.pipe(toArray());
        }),
        tap((groupTimes: Time[]) => {
          const date = groupTimes[0].getDate();
          let item = this.items.find(day => day.isSameDate(date));
          if (item) {
            item.times = groupTimes.sort();
          }
        })
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
      data: {
        date: toEdit.date,
        times: !toEdit.times ? [] : toEdit.times.map((time) => time.clone())
      }
    });

    const deleteOlds$ = from(Array.from(toEdit.times))
      .pipe(
        filter((time) => time.hasId()),
        mergeMap((toDelete) => this.timeClient.delete$(toDelete))
      );

    const createNews$ = (times) => of(times).pipe(
      switchMap(times => from(times)),
      mergeMap((time: Time) => this.timeClient.create$(time.time)),
      toArray()
    );

    dialogRef.afterClosed().pipe(
      filter(x => !!x),
      switchMap((report) => createNews$(report.times)),
      tap((times) => toEdit.times = times),
      switchMap(() => deleteOlds$)
    )
      .subscribe();
  }
}
