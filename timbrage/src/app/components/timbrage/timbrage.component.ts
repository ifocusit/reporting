import { Component, OnInit } from '@angular/core';
import { CalculationService } from '../../services/calculation.service';
import * as moment from 'moment';
import { Duration, Moment } from 'moment';
import { Observable } from 'rxjs/internal/Observable';
import { Time, TimeAdapter } from '../../models/time.model';
import { TimesState, SelectDate, AddTime } from '../../store/time.store';
import { Select, Store } from '@ngxs/store';
import { map, mergeMap } from 'rxjs/operators';
import { timer, combineLatest } from 'rxjs';
import { TimesService } from 'src/app/services/times.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-timbrage',
  templateUrl: './timbrage.component.html',
  styleUrls: ['./timbrage.component.scss']
})
export class TimbrageComponent implements OnInit {
  @Select(TimesState.selectedDate)
  public selectedDate$: Observable<Moment>; // jour sélectionné

  public times$: Observable<Time[]>; // timbrage du jour

  now$: Observable<Date>; // horloge
  sumDay$: Observable<Duration>; // somme des heures travaillées du jour

  constructor(
    private calculationService: CalculationService,
    private timesService: TimesService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit() {
    this.times$ = this.selectedDate$.pipe(mergeMap(date => this.timesService.read(date)));
    // basé sur un timer
    this.now$ = timer(0, 1000).pipe(map(() => new Date()));
    this.sumDay$ = combineLatest(timer(0, 1000), this.times$).pipe(mergeMap(pair => this.calculationService.calculate(pair[1])));

    this.store.dispatch(new SelectDate(moment())); // charge le jour en cours
  }

  public addTimbrage() {
    this.store.dispatch(new AddTime(TimeAdapter.createTime()));
  }

  public openCalendar() {
    this.router.navigate(['/calendar'], { replaceUrl: true });
  }
}
