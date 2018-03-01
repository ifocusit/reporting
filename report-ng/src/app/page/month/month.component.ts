import {Component, OnInit} from '@angular/core';
import {Moment} from 'moment';
import {ReportItem} from '../../model/ReportItem.model';
import {ActivatedRoute} from '@angular/router';
import moment = require('moment');

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.less']
})
export class MonthComponent implements OnInit {

  _month: Moment;
  items: Array<ReportItem>;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this._month = moment(params['month'], 'YYYY-MM');
      if (this._month) {
        this.initDays();
      }
    });
  }

  private initDays(): void {
    this.items = [];
    for (let i = 1; i <= this._month.daysInMonth(); i++) {
      this.items.push(new ReportItem(this._month.clone().date(i)));
    }
  }

  get month(): Moment {
    return this._month;
  }

  set month(date: Moment) {
    this._month = date.date(1);
    this.initDays();
  }

  get workDays(): number {
    return this.items.filter(item => item.duration).length;
  }

  get total(): number {
    return this.items
      .filter(report => report.duration)
      .map(report => report.duration.asHours())
      .reduce((d1, d2) => d1 + d2);
  }
}
