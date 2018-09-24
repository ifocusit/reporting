import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {Select, Store} from "@ngxs/store";
import {TimesStateModel} from "../../store/time.store";

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

    @Select() times$: Observable<TimesStateModel>;

    constructor(private store: Store) {
    }

    ngOnInit() {
    }
}
