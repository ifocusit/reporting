import { Component, OnInit } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ProjectState, ReadSettings } from 'src/app/store/project.store';
import { mergeMap, map } from 'rxjs/operators';
import { ProjectService } from 'src/app/service/project.service';
import { DEFAULT_SETTINGS } from 'src/app/model/settings.model';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { TimesService } from 'src/app/service/times.service';
import { ISO_MONTH } from 'src/app/model/time.model';
import { CalculateDuration } from 'src/app/service/calculate-duration.tools';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {
  @Select(ProjectState.project)
  public project$: Observable<string>;
  public bill$: Observable<any>;
  public logo$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private timesService: TimesService,
    private store: Store
  ) {}

  ngOnInit() {
    const settings$ = this.project$.pipe(mergeMap(projectName => this.projectService.read(projectName)));

    const selectedDate$ = this.route.params.pipe(map(params => moment(params['month'], 'YYYY-MM')));

    const times$ = selectedDate$.pipe(mergeMap(month => this.timesService.read(month.format(ISO_MONTH))));

    const duration$ = times$.pipe(map(times => CalculateDuration(times)));

    this.bill$ = combineLatest(selectedDate$, settings$, times$, duration$).pipe(
      map(data => ({
        month: data[0].format(ISO_MONTH),
        idFacture: `${data[0].format('YYYYMM').replace('20', '2')}1`,
        duration: data[3], // nb heures totales
        amount: this.calculateHT(data[3], data[1].bill.hourlyRate),
        totalHT: this.calculateHT(data[3], data[1].bill.hourlyRate), // same by default
        totalTVA: this.calculateTVA(data[3], data[1].bill.hourlyRate, data[1].bill.tvaRate),
        totalTTC: this.calculateTTC(data[3], data[1].bill.hourlyRate, data[1].bill.tvaRate),
        ...data[1].bill // settings
      }))
    );

    this.logo$ = this.project$.pipe(mergeMap(projectName => this.projectService.readLogo(projectName)));
  }

  private calculateHT(duration: moment.Duration, hourlyRate: number) {
    return duration.asHours() * hourlyRate;
  }

  private calculateTVA(duration: moment.Duration, hourlyRate: number, tvaRate: number) {
    return (duration.asHours() * hourlyRate * tvaRate) / 100;
  }

  private calculateTTC(duration: moment.Duration, hourlyRate: number, tvaRate: number) {
    return this.calculateHT(duration, hourlyRate) + this.calculateTVA(duration, hourlyRate, tvaRate);
  }
}
