import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SwUpdate } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { AuthService } from 'projects/commons/src/lib/auth/auth.service';
import { ReadSettings, SettingsState } from 'projects/commons/src/lib/settings/settings.store';
import { ExportService } from 'projects/commons/src/lib/times/export.service';
import { SelectDate, TimesState } from 'projects/commons/src/lib/times/time.store';
import { TranslationService } from 'projects/commons/src/lib/translation/translation.service';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { MonthGraphDialog } from '../../../commons/src/lib/times/reports/half-donut/month-graph.dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  navLinks = [
    { path: '/timbrage', label: 'timbrage.title' },
    { path: '/calendar', label: 'calendar.title' }
  ];

  @ViewChild('export', { static: true }) private exportLink: ElementRef;

  constructor(
    private swUpdate: SwUpdate,
    private exportService: ExportService,
    private store: Store,
    private authService: AuthService,
    private translate: TranslateService,
    private translationService: TranslationService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.translationService.loadLang('fr');
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available
        .pipe(
          filter(event => !!event),
          mergeMap(() => this.translate.get('messages.update'))
        )
        .subscribe(message => {
          if (confirm(message)) {
            window.location.reload();
          }
        });
    }
    // changement de user => charge le dermier project et ses settings
    this.authService.user$
      .pipe(
        tap(user => this.translationService.loadLang(user.lang)),
        mergeMap(user => this.store.dispatch(new ReadSettings(user.lastProject)))
      )
      .subscribe();

    // changement de theme
    this.store
      .select(SettingsState.theme)
      .pipe(tap(theme => (document.getElementsByTagName('body')[0].classList.value = theme)))
      .subscribe();
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
          this.dialog.open(MonthGraphDialog, {
            width: '280px',
            height: '220px',
            data: month
          })
        )
      )
      .subscribe();
  }
}
