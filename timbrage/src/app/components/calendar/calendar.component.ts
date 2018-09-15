import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {Observable} from "rxjs/internal/Observable";
import {Time} from "../../models/time.model";
import {selectCurrentMonthTimes} from "../../store/time/time.reducer";
import {TimeState} from "../../store/time/time.state";

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

    times$: Observable<Time[]>;

    constructor(private store: Store<TimeState>) {
    }

    ngOnInit() {
        this.times$ = this.store.pipe(select(selectCurrentMonthTimes));
    }
}
