import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-month-card',
  templateUrl: './month-card.component.html',
  styleUrls: ['./month-card.component.scss']
})
export class MonthCardComponent implements OnInit {
  @Input()
  month: string;

  public today = moment().format('YYYY-MM');

  constructor() {}

  ngOnInit(): void {}
}
