import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalculationService } from '../../services/calculation.service';
import * as moment from 'moment';
import { Duration, Moment } from 'moment';
import { Observable } from 'rxjs/internal/Observable';
import { DATE_ISO_FORMAT, Time, TimeAdapter } from '../../models/time.model';
import { TimesState, SelectDate, AddTime } from '../../store/time.store';
import { Select, Store } from '@ngxs/store';
import { map, mergeMap } from 'rxjs/operators';
import { timer, combineLatest } from 'rxjs';
import { TimesService } from 'src/app/services/times.service';

@Component({
  selector: 'app-timbrage',
  templateUrl: './timbrage.component.html',
  styleUrls: ['./timbrage.component.scss']
})
export class TimbrageComponent implements OnInit {
  now$: Observable<Date>;
  sumDay$: Observable<Duration>;

  @Select(TimesState.selectedDate)
  public selectedDate$: Observable<Moment>;

  public times$: Observable<Time[]>;

  private timer$ = timer(0, 1000);

  constructor(private calculationService: CalculationService, private timesService: TimesService, private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new SelectDate(moment()));
    this.times$ = this.selectedDate$.pipe(mergeMap(date => this.timesService.read(date)));
    this.now$ = timer(0, 1000).pipe(map(() => new Date()));
    this.sumDay$ = combineLatest(this.timer$, this.times$).pipe(map(pair => this.calculationService.calculate(pair[1])));
  }

  public addTimbrage() {
    this.store.dispatch(new AddTime(TimeAdapter.createTime()));
  }
}
