import { Component, OnInit, ViewChild, ElementRef, HostBinding } from '@angular/core';
import { AuthService } from 'projects/commons/src/lib/auth/auth.service';
import { Store } from '@ngxs/store';
import { ExportService } from 'projects/commons/src/lib/times/export.service';
import { TimesState, SelectDate } from 'projects/commons/src/lib/times/time.store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ProjectService } from 'projects/commons/src/lib/settings/project.service';
import { mergeMap, tap } from 'rxjs/operators';
import { Settings } from 'projects/commons/src/lib/settings/settings.model';
import { ProjectState } from 'projects/commons/src/lib/settings/project.store';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SwUpdate } from '@angular/service-worker';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  navLinks = [{ path: '/timbrage', label: 'Timbrage' }, { path: '/calendar', label: 'Calendar' }];

  @ViewChild('export', { static: true }) private exportLink: ElementRef;

  public settings$: Observable<Settings>;
  @HostBinding('class') componentCssClass;

  constructor(
    private swUpdate: SwUpdate,
    private exportService: ExportService,
    private store: Store,
    private authService: AuthService,
    private settingsService: ProjectService,
    public overlayContainer: OverlayContainer
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
    this.settings$ = this.store.select(ProjectState.project).pipe(
      mergeMap(projectName => this.settingsService.readSettings(projectName)),
      tap(settings => {
        this.overlayContainer.getContainerElement().classList.add(settings.project.theme);
        this.componentCssClass = settings.project.theme;
      })
    );
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
