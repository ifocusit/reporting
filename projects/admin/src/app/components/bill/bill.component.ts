import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { mergeMap, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ProjectService } from 'projects/commons/src/lib/settings/project.service';
import { TimesService } from 'projects/commons/src/lib/times/times.service';
import { MONTH_ISO_FORMAT } from 'projects/commons/src/lib/times/time.model';
import { CalculateDuration } from 'projects/commons/src/lib/times/calculate-duration.tools';
import { SettingsState } from 'projects/commons/src/lib/settings/settings.store';
import { Settings } from 'projects/commons/src/lib/settings/settings.model';
import { ProjectState } from 'projects/commons/src/lib/settings/project.store';
import { BillService } from '../../services/bill.service';
import { BillLine } from '../../models/bill.model';
import { SelectDate, TimesState } from 'projects/commons/src/lib/times/time.store';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {
  @Select(ProjectState.project)
  public project$: Observable<string>;
  @Select(SettingsState.settings)
  public settings$: Observable<Settings>;

  @Select(TimesState.selectedDate)
  public selectedDate$: Observable<moment.Moment>;

  public model$: Observable<any>;
  public logo$: Observable<string>;
  public lines$: Observable<BillLine[]>;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private timesService: TimesService,
    private billService: BillService,
    private store: Store
  ) {}

  ngOnInit() {
    this.route.params.pipe(mergeMap(params => this.store.dispatch(new SelectDate(moment(params.month, 'YYYY-MM'))))).subscribe();

    // work times duration
    const duration$ = this.selectedDate$.pipe(
      mergeMap(month => this.timesService.read(month.format(MONTH_ISO_FORMAT))),
      map(times => CalculateDuration(times))
    );

    // potential lines manually added
    this.lines$ = this.billService.lines$;

    // screen model that is a combination of settings, work times duration and manual bill's lines
    // we subscribe of every compounts' modifications
    this.model$ = combineLatest(this.selectedDate$, this.settings$, this.lines$, duration$).pipe(
      map(data => ({ selectedDate: data[0], settings: data[1], lines: data[2], duration: data[3] })),
      map(({ selectedDate, settings, lines, duration }) => ({
        month: selectedDate.format(MONTH_ISO_FORMAT),
        idFacture: `${selectedDate.format('YYYYMM').replace('20', '2')}1`,
        duration, // nb heures totales
        amount: this.billService.calculatWorkAmount(duration, settings.bill.hourlyRate),
        totalHT: this.billService.calculateHT(duration, settings.bill.hourlyRate, lines),
        totalTVA: this.billService.calculateTVA(duration, settings.bill.hourlyRate, settings.bill.tvaRate, lines),
        totalTTC: this.billService.calculateTTC(duration, settings.bill.hourlyRate, settings.bill.tvaRate, lines),
        project: settings.project,
        ...settings.bill // settings
      }))
    );

    this.logo$ = this.project$.pipe(mergeMap(projectName => this.projectService.readLogo(projectName)));
  }

  public addLine() {
    this.billService.addLine({ label: 'nouvelle ligne' }).subscribe();
  }

  public updateLine(line) {
    this.billService.updateLine(line).subscribe();
  }

  public deleteLine(line) {
    this.billService.deleteLine(line).subscribe();
  }

  public print() {
    window.print();
  }
}
