import { Component, OnInit } from '@angular/core';
import { MONTH_ISO_FORMAT } from '@ifocusit/commons';
import * as moment from 'moment';

@Component({
  selector: 'ifocusit-month-list',
  templateUrl: './month-list.component.html',
  styleUrls: ['./month-list.component.scss']
})
export class MonthListComponent implements OnInit {
  private step = 3;
  months: string[] = [moment().format(MONTH_ISO_FORMAT)];

  constructor() {}

  ngOnInit(): void {}

  next() {
    let date = moment(this.months[this.months.length - 1]);
    for (let index = 0; index < this.step; index++) {
      date = date.add(-1, 'month');
      this.months.push(date.format(MONTH_ISO_FORMAT));
    }
  }
}
