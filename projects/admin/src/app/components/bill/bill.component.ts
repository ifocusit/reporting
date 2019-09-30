import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import * as moment from 'moment';
import { ProjectService } from 'projects/commons/src/lib/settings/project.service';
import { ProjectState } from 'projects/commons/src/lib/settings/project.store';
import { Settings } from 'projects/commons/src/lib/settings/settings.model';
import { SettingsState } from 'projects/commons/src/lib/settings/settings.store';
import { CalculateDuration } from 'projects/commons/src/lib/times/calculate-duration.tools';
import { MONTH_ISO_FORMAT } from 'projects/commons/src/lib/times/time.model';
import { SelectDate, TimesState } from 'projects/commons/src/lib/times/time.store';
import { TimesService } from 'projects/commons/src/lib/times/times.service';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { BillLine } from '../../models/bill.model';
import { BillService } from '../../services/bill.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit, OnDestroy {
  @Select(ProjectState.project)
  public project$: Observable<string>;
  @Select(SettingsState.settings)
  public settings$: Observable<Settings>;

  @Select(TimesState.selectedDate)
  public selectedDate$: Observable<moment.Moment>;

  public model$: Observable<any>;
  public logo$: Observable<string>;
  public lines$: Observable<BillLine[]>;

  public archiveBill$ = (file: File) => this.billService.archive(file);

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
      mergeMap(month => this.timesService.read(month, 'month')),
      map(times => CalculateDuration(times))
    );

    // potential lines manually added
    this.lines$ = this.billService.lines$;

    const bill$ = this.billService.bill$;

    // screen model that is a combination of settings, work times duration and manual bill's lines
    // we subscribe of every compounts' modifications
    this.model$ = combineLatest(this.selectedDate$, this.settings$, this.lines$, duration$, bill$).pipe(
      map(data => ({ selectedDate: data[0], settings: data[1], lines: data[2], duration: data[3], bill: data[4] })),
      tap(({ selectedDate, settings }) => (document.title = `Facture ${settings.project.name} ${selectedDate.format(MONTH_ISO_FORMAT)}`)),
      map(({ selectedDate, settings, lines, duration, bill }) => ({
        month: selectedDate.format(MONTH_ISO_FORMAT),
        idFacture: `${selectedDate.format('YYYYMM').replace('20', '2')}1`,
        duration, // nb heures totales
        amount: this.billService.calculatWorkAmount(duration, settings.bill.hourlyRate),
        totalHT: this.billService.calculateHT(duration, settings.bill.hourlyRate, lines),
        totalTVA: this.billService.calculateTVA(duration, settings.bill.hourlyRate, settings.bill.tvaRate, lines),
        totalTTC: this.billService.calculateTTC(duration, settings.bill.hourlyRate, settings.bill.tvaRate, lines),
        project: settings.project,
        ...settings.bill, // settings
        ...bill // saved data
      }))
    );

    this.logo$ = this.project$.pipe(mergeMap(projectName => this.projectService.readLogo(projectName)));
  }

  ngOnDestroy(): void {
    document.title = 'Reporting';
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
