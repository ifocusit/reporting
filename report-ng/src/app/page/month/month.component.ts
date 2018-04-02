import {Component, OnInit} from '@angular/core';
import {Moment} from 'moment';
import {ReportItem} from '../../model/ReportItem.model';
import {ActivatedRoute} from '@angular/router';
import {ActivityClient} from "../../client/activity-client.service";
import {Activity, ActivityType} from "../../model/Activity.model";
import moment = require('moment');

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.less']
})
export class MonthComponent implements OnInit {

  _month: Moment;
  items: Array<ReportItem>;

  constructor(private route: ActivatedRoute, private activityClient: ActivityClient) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.month = moment(params['month'], 'YYYY-MM');
    });
  }

  private initDays(): void {
    this.items = [];
    for (let i = 1; i <= this._month.daysInMonth(); i++) {
      this.items.push(new ReportItem(this._month.clone().date(i)));
    }
    this.activityClient.getActivities$(this._month.format('YYYY-MM'))
      .subscribe(activities => activities.forEach((activity: Activity) => {
        let item = this.items.find(item => item.isSameDate(activity.date));
        if (item) {
          item.duration = activity.duration;
        }
      }))
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
    return this.items
      .filter(report => report.duration)
      .map(report => report.getDuration().asHours())
      .reduce((d1, d2) => d1 + d2);
  }

  save(date: Moment, duration: string) {
    this.activityClient.saveActivity$(date.format('YYYY-MM-DD'), duration,
      duration == null ? ActivityType.OFF : ActivityType.WORK).subscribe();
  }
}
