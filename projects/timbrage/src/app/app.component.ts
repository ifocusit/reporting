import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'projects/commons/src/lib/auth/auth.service';
import { Store } from '@ngxs/store';
import { ExportService } from 'projects/commons/src/lib/times/export.service';
import { TimesState, SelectDate } from 'projects/commons/src/lib/times/time.store';
import * as moment from 'moment';
import { ProjectService } from 'projects/commons/src/lib/settings/project.service';
import { mergeMap, tap } from 'rxjs/operators';
import { ProjectState, SelectProject } from 'projects/commons/src/lib/settings/project.store';
import { SwUpdate } from '@angular/service-worker';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';
import { SettingsState, ReadSettings } from 'projects/commons/src/lib/settings/settings.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  navLinks = [{ path: '/timbrage', label: 'Timbrage' }, { path: '/calendar', label: 'Calendar' }];

  @ViewChild('export', { static: true }) private exportLink: ElementRef;

  constructor(
    private swUpdate: SwUpdate,
    private exportService: ExportService,
    private store: Store,
    private authService: AuthService,
    private settingsService: ProjectService
  ) {
    registerLocaleData(localeFr, 'fr', localeFrExtra);
    moment.locale('fr');
  }

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('Une nouvelle version est disponible. Voulez-vous la charger ?')) {
          window.location.reload();
        }
      });
    }
    // changement de user => charge le dermier project et ses settings
    this.authService.user$
      .pipe(
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
