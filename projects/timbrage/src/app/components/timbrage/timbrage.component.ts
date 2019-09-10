import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Duration, Moment } from 'moment';
import { Observable } from 'rxjs/internal/Observable';
import { Select, Store } from '@ngxs/store';
import { map, mergeMap, take, pairwise } from 'rxjs/operators';
import { timer, combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { TimesService } from 'projects/commons/src/lib/times/times.service';
import { CalculationService } from 'projects/commons/src/lib/times/calculation.service';
import { TimesState, SelectDate, AddTime } from 'projects/commons/src/lib/times/time.store';
import { Time, TimeAdapter, MONTH_ISO_FORMAT } from 'projects/commons/src/lib/times/time.model';
import { ProjectState } from 'projects/commons/src/lib/settings/project.store';
import * as _ from 'lodash';
import { DEFAULT_DAY_DURATION } from 'projects/admin/src/app/models/working-date-reporting.model';

@Component({
  selector: 'app-timbrage',
  templateUrl: './timbrage.component.html',
  styleUrls: ['./timbrage.component.scss']
})
export class TimbrageComponent implements OnInit {
  @Select(ProjectState.project)
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
  courseMonth$: Observable<Duration>; // avancement des heures sur le mois en cours

  constructor(
    private calculationService: CalculationService,
    private timesService: TimesService,
    private store: Store,
    private router: Router
  ) { }

  ngOnInit() {
    this.times$ = combineLatest(this.project$, this.selectedDate$).pipe(mergeMap(pair => this.timesService.read(pair[1])));

    this.sumWeek$ = combineLatest(this.project$, this.selectedDate$, timer(0, 1000)).pipe(
      map(pair => pair[1]),
      mergeMap(date => this.timesService.read(date, 'week')),
      mergeMap(times => this.calculationService.calculate(times))
    );

    this.courseMonth$ = combineLatest(this.project$, this.selectedDate$, timer(0, 1000)).pipe(
      map(pair => pair[1]),
      mergeMap(date => this.timesService.read(date, 'month')),
      // compte le nombre de jours travaillés (avec un timbrage)
      map(times => _.uniq(times.map(time => new TimeAdapter(time).getDate())).length),
      pairwise(),
      mergeMap(pair => this.calculationService.calculate(pair[0]) // durée de travail du mois
        .pipe(
          // on soustrait les heures attendues pour avoir l'avancement du mois
          map(duration => duration.subtract(moment.duration(pair[1] * DEFAULT_DAY_DURATION, 'hours')))
        )),
    );

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
