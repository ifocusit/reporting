import {Component, OnInit} from '@angular/core';
import {Moment} from 'moment';
import {ReportItem} from '../../model/ReportItem.model';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.css']
})
export class MonthComponent implements OnInit {

  _month: Moment;
  items: Array<ReportItem>;

  constructor() {
  }

  ngOnInit() {
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
}
