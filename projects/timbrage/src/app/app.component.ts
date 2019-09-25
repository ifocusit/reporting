import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { AuthService } from 'projects/commons/src/lib/auth/auth.service';
import { SelectProject } from 'projects/commons/src/lib/settings/project.store';
import { ReadSettings, SettingsState } from 'projects/commons/src/lib/settings/settings.store';
import { ExportService } from 'projects/commons/src/lib/times/export.service';
import { SelectDate, TimesState } from 'projects/commons/src/lib/times/time.store';
import { TranslationService } from 'projects/commons/src/lib/translation/translation.service';
import { filter, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  navLinks = [{ path: '/timbrage', label: 'timbrage.title' }, { path: '/calendar', label: 'calendar.title' }];

  @ViewChild('export', { static: true }) private exportLink: ElementRef;

  constructor(
    private swUpdate: SwUpdate,
    private exportService: ExportService,
    private store: Store,
    private authService: AuthService,
    private translate: TranslateService,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
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
        mergeMap(user => this.store.dispatch(new SelectProject(user.lastProject))),
        mergeMap(_ => this.store.dispatch(new ReadSettings()))
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
}
