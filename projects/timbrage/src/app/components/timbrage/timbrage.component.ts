import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import * as moment from 'moment';
import { Duration, Moment } from 'moment';
import { SettingsState } from 'projects/commons/src/lib/settings/settings.store';
import { CalculationService } from 'projects/commons/src/lib/times/calculation.service';
import { DATE_ISO_FORMAT, Time, TimeAdapter } from 'projects/commons/src/lib/times/time.model';
import { AddTime, SelectDate, TimesState } from 'projects/commons/src/lib/times/time.store';
import { TimesService } from 'projects/commons/src/lib/times/times.service';
import { combineLatest, timer } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { map, mergeMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-timbrage',
  templateUrl: './timbrage.component.html',
  styleUrls: ['./timbrage.component.scss']
})
export class TimbrageComponent implements OnInit {
  @Select(SettingsState.project)
  public project$: Observable<string>; // projet sélectionné

  @Select(TimesState.selectedDate)
  public selectedDate$: Observable<Moment>; // jour sélectionné

  public times$: Observable<Time[]>; // timbrage du jour

  public now$ = combineLatest(timer(0, 1000), this.selectedDate$).pipe(
    map(pair => pair[1]),
    map(date =>
      moment()
        .date(date.date())
        .month(date.month())
        .year(date.year())
    )
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
    const month$ = combineLatest(this.project$, this.selectedDate$).pipe(mergeMap(pair => this.timesService.read(pair[1], 'month')));

    this.times$ = combineLatest(month$, this.selectedDate$).pipe(
      // filtre sur le jour sélectionné
      map(pair => pair[0].filter(time => new TimeAdapter(time).getDay() === pair[1].format(DATE_ISO_FORMAT)))
    );

    this.sumWeek$ = combineLatest(month$, this.selectedDate$).pipe(
      // filtre sur la semaine du jour sélectionné
      map(pair => pair[0].filter(time => new TimeAdapter(time).getMoment().week() === pair[1].week())),
      // total hebdomadaire
      mergeMap(times => this.calculationService.calculate(times, false))
    );

    // avancement sur le mois
    this.progess$ = month$.pipe(mergeMap(times => this.calculationService.calculate(times, false)));
    // this.progess$ = combineLatest(month$, this.selectedDate$).pipe(
    //   mergeMap(pair =>
    //     // on va se consentrer ici uniquement sur les jours échus du mois
    //     // transform en WorkingDateReporting, ce qui regroupe les timbrage par jour
    //     // et fourni des méthodes utiles
    //     of(
    //       _.range(pair[1].date()).map((dayIndex: number) => {
    //         const date = pair[1].clone().date(dayIndex + 1);
    //       return new WorkingDateReporting(date, pair[0].filter(time => date.format(DATE_ISO_FORMAT) === new TimeAdapter(time).getDay()));
    //       })
    //     ).pipe(
    //       map((pastDays: WorkingDateReporting[]) => pastDays.filter(day => !day.isHoliday && !day.isWeekend).length),
    //       // temps de travaillé demandé
    //       map(expectedWorkDays => DurationPipe.clean(moment.duration(expectedWorkDays * DEFAULT_DAY_DURATION))),
    //       tap(data => console.log(data)),
    //       // diff avec l'actuel
    //       mergeMap(expected =>
    //         this.calculationService.calculate(pair[0], false).pipe(map((duration: Duration) => duration.subtract(expected)))
    //       )
    //     )
    //   )
    // );

    // basé sur un timer
    this.sumDay$ = combineLatest(timer(0, 1000), this.times$).pipe(mergeMap(pair => this.calculationService.calculate(pair[1])));

    this.store.dispatch(new SelectDate(moment())); // charge le jour en cours
  }

  public addTimbrage() {
    this.selectedDate$
      .pipe(
        take(1),
        map(date =>
          moment()
            .date(date.date())
            .month(date.month())
            .year(date.year())
        ),
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
