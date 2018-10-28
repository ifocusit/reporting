import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {Select, Store} from "@ngxs/store";
import {AddTime, ReadTimes, TimesState} from "../../store/time.store";
import * as moment from "moment";
import {Moment} from "moment";
import {DATETIME_ISO_FORMAT, Time} from "../../models/time.model";
import {map, withLatestFrom} from "rxjs/operators";
import {CalculationService} from "../../services/calculation.service";

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

    public selected;
    public days = [];
    public weekDays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

    @Select(TimesState.times) times$: Observable<Time[]>;
    @Select(TimesState.loading) loading$: Observable<boolean>;
    sumDay$: Observable<string>;

    constructor(private store: Store, private calculationService: CalculationService) {
    }

    ngOnInit() {

        this.sumDay$ = this.times$.pipe(
            map(times => this.calculationService.calculate(times)),
            map(duration => duration.toISOString().replace("PT", "").toLowerCase()),
            map(value => value === 'p0d' ? '' : value)
        );

        this.select(moment());
        this.changeMonth(0);
    }

    public changeMonth(change: number) {
        this.selected.add(change, 'months');
        this.days = this.getDaysInMonth();
    }

    public select(date: Moment) {
        this.selected = date;
        this.store.dispatch(new ReadTimes(this.selected.format("YYYY-MM-DD")));
    }

    public addTimbrage() {
        const time = moment().date(this.selected.date()).month(this.selected.month()).year(this.selected.year());
        this.store.dispatch([new AddTime(new Time(time.format(DATETIME_ISO_FORMAT)))]).pipe(withLatestFrom(this.times$));
    }

    private getDaysInMonth() {
        const days = [];
        let date = moment(this.selected).date(1);
        while (date.days() !== 1) {
            date.add(-1, 'days');
            days.unshift(moment(date));
        }
        date = moment(this.selected).date(1);
        const daysInMonth = this.selected.daysInMonth();
        for (let i = 0; i < daysInMonth; i++) {
            days.push(moment(date));
            date.add(1, 'days');
        }
        while (days.length < 35) {
            days.push(moment(date));
            date.add(1, 'days');
        }
        return days;
    }
}
