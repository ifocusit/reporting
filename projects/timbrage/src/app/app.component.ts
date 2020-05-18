import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwUpdate } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { DefaultAppComponent } from 'projects/commons/src/lib/app/default-app.component';
import { AuthService } from 'projects/commons/src/lib/auth/auth.service';
import { BillService } from 'projects/commons/src/lib/bill/bill.service';
import { ExportService } from 'projects/commons/src/lib/times/export.service';
import { SelectDate, TimesState } from 'projects/commons/src/lib/times/time.store';
import { TranslationService } from 'projects/commons/src/lib/translation/translation.service';
import { tap } from 'rxjs/operators';
import { MonthGraphDialogComponent } from '../../../commons/src/lib/times/reports/half-donut/month-graph.dialog';

@Component({
  selector: 'app-root',
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
