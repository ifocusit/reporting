import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwUpdate } from '@angular/service-worker';
import {
  AuthService,
  BillService,
  DefaultAppComponent,
  ExportService,
  MonthGraphDialogComponent,
  SelectDate,
  TimesState,
  TranslationService
} from '@ifocusit/commons';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'ifocusit-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends DefaultAppComponent {
  navLinks = [
    { path: '/timbrage', label: 'timbrage.title' },
    { path: '/calendar', label: 'calendar.title' }
  ];

  @ViewChild('export', { static: true }) private exportLink: ElementRef;

  bill$ = this.billService.bill$;

  constructor(
    swUpdate: SwUpdate,
    store: Store,
    authService: AuthService,
    translate: TranslateService,
    translationService: TranslationService,
    private exportService: ExportService,
    public dialog: MatDialog,
    private billService: BillService
  ) {
    super(swUpdate, store, authService, translate, translationService);
  }

  public calendarPage() {
    return this.isPage('calendar');
  }

  public profilePage() {
    return this.isPage('profile');
  }

  public timbragePage() {
    return this.isPage('timbrage');
  }

  public loginPage() {
    return this.isPage('login');
  }

  private isPage(pageName: string) {
    return window.location.pathname.match(`/${pageName}`);
  }

  public exportMonth() {
    const date = this.store.selectSnapshot(TimesState.selectedDate);
    this.exportService.exportMonth(date, this.exportLink);
  }

  public goToday() {
    this.store.dispatch(new SelectDate(moment()));
  }

  signOut() {
    this.authService.signOutUser();
  }

  public showGraph() {
    this.store
      .selectOnce(TimesState.selectedMonth)
      .pipe(
        tap(month =>
          this.dialog.open(MonthGraphDialogComponent, {
            width: '280px',
            height: '220px',
            data: month
          })
        )
      )
      .subscribe();
  }
}
