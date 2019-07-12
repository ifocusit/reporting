import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalculationService } from '../../services/calculation.service';
import * as moment from 'moment';
import { Duration } from 'moment';
import { Observable } from 'rxjs/internal/Observable';
import { DATE_ISO_FORMAT, Time, TimeAdapter } from '../../models/time.model';
import { AddTime, ReadTimes, TimesState } from '../../store/time.store';
import { Select, Store } from '@ngxs/store';
import { map, withLatestFrom, startWith, tap } from 'rxjs/operators';
import { interval, Subject, timer } from 'rxjs';

@Component({
  selector: 'app-timbrage',
  templateUrl: './timbrage.component.html',
  styleUrls: ['./timbrage.component.scss'],
})
export class TimbrageComponent implements OnInit {
  now$: Observable<Date>;
  sumDay$: Observable<Duration>;

  @Select(TimesState.times) times$: Observable<Time[]>;

  constructor(private calculationService: CalculationService, private store: Store) {}

  ngOnInit() {
    this.startTimers();
    this.store.dispatch(new ReadTimes(moment().format(DATE_ISO_FORMAT)));
  }

  private startTimers() {
    this.now$ = timer(0, 1000).pipe(map(() => new Date()));
    this.sumDay$ = timer(0, 1000).pipe(map(() => this.calculationService.calculate(this.store.selectSnapshot(TimesState.times))));
  }

  public addTimbrage() {
    this.store.dispatch([new AddTime([TimeAdapter.createTime()])]).pipe(withLatestFrom(this.times$));
  }
}
