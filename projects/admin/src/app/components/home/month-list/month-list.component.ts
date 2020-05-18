import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Observable, range } from 'rxjs';
import { map, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-month-list',
  templateUrl: './month-list.component.html',
  styleUrls: ['./month-list.component.scss']
})
export class MonthListComponent implements OnInit {
  public months$: Observable<string[]>;

  constructor() {}

  ngOnInit(): void {
    this.months$ = range(0, 12).pipe(
      map(index => moment().month(index).format('YYYY-MM')),
      toArray()
    );
  }
}
