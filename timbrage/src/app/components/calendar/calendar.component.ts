import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {TimeListState, TimeState} from "../../store/time/time.state";
import {Observable} from "rxjs/internal/Observable";
import * as TimeAction from "../../store/time/time.action";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  times$: Observable<TimeState[]>;

  constructor(private store: Store<TimeListState>) {
  }

  ngOnInit() {
    this.times$ = this.store.pipe(select(state => state.times));
    this.store.dispatch(new TimeAction.GetTimes());
  }

}
