import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AddTime,
  CalculationService,
  DATE_ISO_FORMAT,
  SelectDate,
  SettingsState,
  Time,
  TimeAdapter,
  TimesService,
  TimesState
} from '@ifocusit/commons';
import { Select, Store } from '@ngxs/store';
import * as moment from 'moment';
import { Duration, Moment } from 'moment';
import { combineLatest, timer } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { map, mergeMap, take } from 'rxjs/operators';

@Component({
  selector: 'ifocusit-timbrage',
  templateUrl: './timbrage.component.html',
  styleUrls: ['./timbrage.component.scss']
})
export class TimbrageComponent implements OnInit {
  @Select(SettingsState.project)
  public project$: Observable<string>; // projet sélectionné

  @Select(TimesState.selectedDate)
  public selectedDate$: Observable<Moment>; // jour sélectionné

  public times$: Observable<Time[]>; // timbrage du jour

  public now$ = combineLatest([timer(0, 1000), this.selectedDate$]).pipe(
    map(pair => pair[1]),
    map(date => moment().year(date.year()).month(date.month()).date(date.date()))
  );

  sumDay$: Observable<Duration>; // somme des heures travaillées du jour
  sumWeek$: Observable<Duration>; // somme des heures travaillées de la semaine
  progess$: Observable<any>; // avancement des heures sur le mois en cours

  constructor(
    private calculationService: CalculationService,
    private timesService: TimesService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit() {
    // on s'abonne au timbrages du mois
    const month$ = combineLatest([this.project$, this.selectedDate$]).pipe(mergeMap(pair => this.timesService.read(pair[1], 'month')));

    this.times$ = combineLatest([month$, this.selectedDate$]).pipe(
      // filtre sur le jour sélectionné
      map(pair => pair[0].filter(time => new TimeAdapter(time).getDay() === pair[1].format(DATE_ISO_FORMAT)))
    );

    this.sumWeek$ = combineLatest([month$, this.selectedDate$]).pipe(
      // filtre sur la semaine du jour sélectionné
      map(pair => pair[0].filter(time => new TimeAdapter(time).getMoment().week() === pair[1].week())),
      // total hebdomadaire
      mergeMap(times => this.calculationService.calculate(times, false))
    );

    // avancement sur le mois
    this.progess$ = month$.pipe(mergeMap(times => this.calculationService.calculate(times, false)));

    // basé sur un timer
    this.sumDay$ = combineLatest([timer(0, 1000), this.times$]).pipe(mergeMap(pair => this.calculationService.calculate(pair[1])));

    this.store.dispatch(new SelectDate(moment())); // charge le jour en cours
  }

  public addTimbrage() {
    window.navigator.vibrate(500);
    this.selectedDate$
      .pipe(
        take(1),
        map(date => moment().day(date.day()).month(date.month()).year(date.year())),
        mergeMap(date => this.store.dispatch(new AddTime(TimeAdapter.createTime(date))))
      )
      .subscribe();
  }

  public openCalendar() {
    this.router.navigate(['/calendar'], { replaceUrl: true });
  }

  public changeDay(change: number) {
    const date = this.store.selectSnapshot(TimesState.selectedDate);
    this.store.dispatch(new SelectDate(moment(date).add(change, 'day')));
  }
}
