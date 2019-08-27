import { Component, OnInit, HostBinding } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';
import * as moment from 'moment';
import { SwUpdate } from '@angular/service-worker';
import { Observable } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ProjectState } from 'projects/commons/src/lib/settings/project.store';
import { mergeMap, tap } from 'rxjs/operators';
import { ProjectService } from 'projects/commons/src/lib/settings/project.service';
import { Store } from '@ngxs/store';
import { Settings } from 'projects/commons/src/lib/settings/settings.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public settings$: Observable<Settings>;
  @HostBinding('class') componentCssClass;

  constructor(
    private swUpdate: SwUpdate,
    private store: Store,
    private settingsService: ProjectService,
    public overlayContainer: OverlayContainer
  ) {
    registerLocaleData(localeFr, 'fr', localeFrExtra);
    moment.locale('fr');
  }

  ngOnInit(): void {
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
        document.getElementsByTagName('body')[0].classList.value = settings.project.theme;
      })
    );
  }
}
