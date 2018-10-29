import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {Select, Store} from "@ngxs/store";
import {AddTime, TimesState} from "../../store/time.store";
import * as moment from "moment";
import {Moment} from "moment";
import {DATETIME_ISO_FORMAT, Time} from "../../models/time.model";
import {map} from "rxjs/operators";
import {CalculationService} from "../../services/calculation.service";
import {CalendarState, MoveMonth, SelectDate} from "../../store/calendar.store";

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

    public weekDays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

    @Select(TimesState.times) times$: Observable<Time[]>;
    @Select(TimesState.date) selected$: Observable<Moment>;
    @Select(TimesState.loading) loading$: Observable<Moment>;
    @Select(CalendarState.days) days$: Observable<Moment[]>;

    sumDay$: Observable<string>;

    constructor(private store: Store, private calculationService: CalculationService) {
    }

    ngOnInit() {
        this.sumDay$ = this.times$.pipe(
            map(times => this.calculationService.calculate(times, false)),
            map(duration => duration.toISOString().replace("P", "").replace("T", "").toLowerCase())
        );

        this.select(moment());
    }

    public changeMonth(change: number) {
        this.store.dispatch(new MoveMonth(change));
    }

    public select(date: Moment) {
        this.store.dispatch(new SelectDate(date));
    }

    public addTimbrage() {
        const selected = this.store.selectSnapshot(TimesState.date);
        const time = moment().date(selected.date()).month(selected.month()).year(selected.year());
        this.store.dispatch([new AddTime(new Time(time.format(DATETIME_ISO_FORMAT)))]);
    }
}
