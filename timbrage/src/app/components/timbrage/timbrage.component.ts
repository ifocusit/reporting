import {Component, OnDestroy, OnInit} from "@angular/core";
import {CalculationService} from "../../services/calculation.service";
import * as moment from "moment";
import {Duration} from "moment";
import {Observable} from "rxjs/internal/Observable";
import {Time} from "../../models/time.model";
import {AddTime, ReadTimes, TimesState} from "../../store/time.store";
import {Select, Store} from '@ngxs/store';
import {withLatestFrom} from "rxjs/operators";


@Component({
    selector: 'app-timbrage',
    templateUrl: './timbrage.component.html',
    styleUrls: ['./timbrage.component.scss']
})
export class TimbrageComponent implements OnInit, OnDestroy {
    now = new Date();
    // timerDay: any;

    @Select(TimesState.times) times$: Observable<Time[]>;
    @Select(TimesState.loading) loading$: Observable<boolean>;

    sumDay: Duration = moment.duration();

    constructor(private calculationService: CalculationService, private store: Store) {
    }

    ngOnInit() {
        this.startTimers();
        this.store.dispatch(new ReadTimes(moment().format("YYYY-MM-DD")));
    }

    private startTimers(): void {

        // this.timerDay = setInterval(() => {
        //   this.now = new Date();
        //   this.calculationService.calculate(this.times).then((duration) => this.sumDay = duration);
        // }, 1000);
    }

    private stopTimers() {
        // if (this.timerDay) clearInterval(this.timerDay);
    }

    ngOnDestroy(): void {
        this.stopTimers()
    }

    public addTimbrage() {
        this.store.dispatch([new AddTime(new Time())]).pipe(withLatestFrom(this.times$));
    }
}
