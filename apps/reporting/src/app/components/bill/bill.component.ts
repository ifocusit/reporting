import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CalculateDuration,
  MONTH_ISO_FORMAT,
  ProjectService,
  SelectDate,
  Settings,
  SettingsState,
  TimesService,
  TimesState
} from '@ifocusit/commons';
import { Select, Store } from '@ngxs/store';
import * as moment from 'moment';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { BillLine } from '../../models/bill.model';
import { Attachment, EditBillService } from '../../services/edit-bill.service';

@Component({
  selector: 'ifocusit-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit, OnDestroy {
  @Select(SettingsState.project)
  project$: Observable<string>;
  @Select(SettingsState.settings)
  settings$: Observable<Settings>;

  @Select(TimesState.selectedDate)
  selectedDate$: Observable<moment.Moment>;

  model$: Observable<any>;
  logo$: Observable<string>;
  lines$: Observable<BillLine[]>;

  archiveBill$ = (file: File) => this.billService.archive$(file);
  addAttachment$ = (file: File) => this.billService.addAttachment$(file).pipe(tap(() => this.notifyUpdateAttachments.next()));

  private notifyUpdateAttachments = new ReplaySubject();
  attachments$ = this.notifyUpdateAttachments.pipe(mergeMap(() => this.billService.attachments$));

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private timesService: TimesService,
    private billService: EditBillService,
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
    this.model$ = combineLatest([this.selectedDate$, this.settings$, this.lines$, duration$, bill$]).pipe(
      map(data => ({ selectedDate: data[0], settings: data[1], lines: data[2], duration: data[3], bill: data[4] })),
      tap(({ selectedDate, settings }) => (document.title = `Facture ${settings.project.name} ${selectedDate.format(MONTH_ISO_FORMAT)}`)),
      map(({ selectedDate, settings, lines, duration, bill }) => ({
        month: selectedDate.format(MONTH_ISO_FORMAT),
        idFacture: `${selectedDate.format('YYYYMM').replace('20', '2')}1`,
        duration, // nb heures totales
        amount: this.billService.calculatWorkAmount(duration, bill.detail.hourlyRate),
        totalHT: this.billService.calculateHT(duration, bill.detail.hourlyRate, lines),
        totalTVA: this.billService.calculateTVA(duration, bill.detail.hourlyRate, bill.detail.tvaRate, lines),
        totalTTC: this.billService.calculateTTC(duration, bill.detail.hourlyRate, bill.detail.tvaRate, lines),
        project: settings.project,
        ...settings.bill, // settings
        ...bill // saved data
      }))
    );

    this.logo$ = this.project$.pipe(mergeMap(projectName => this.projectService.readLogo(projectName)));

    this.notifyUpdateAttachments.next();
  }

  ngOnDestroy(): void {
    document.title = 'Reporting';
  }

  addLine() {
    this.billService.addLine({ label: 'nouvelle ligne' });
  }

  updateLine(line) {
    this.billService.updateLine(line);
  }

  deleteLine(line) {
    this.billService.deleteLine(line);
  }

  print() {
    window.print();
  }

  deleteAttachment(attachement: Attachment) {
    this.billService.deleteAttachment(attachement).then(() => this.notifyUpdateAttachments.next());
  }

  openBillPdf() {
    this.billService.generateBillPdf();
  }
}
