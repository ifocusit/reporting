import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';
import * as moment from 'moment';
import { SwUpdate } from '@angular/service-worker';
import { Observable } from 'rxjs';
import { ProjectState, SelectProject } from 'projects/commons/src/lib/settings/project.store';
import { mergeMap, tap, take } from 'rxjs/operators';
import { ProjectService } from 'projects/commons/src/lib/settings/project.service';
import { Store, Select } from '@ngxs/store';
import { AuthService } from 'projects/commons/src/lib/auth/auth.service';
import { SettingsState, ReadSettings } from 'projects/commons/src/lib/settings/settings.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Select(ProjectState.project)
  public project$: Observable<string>;

  constructor(private swUpdate: SwUpdate, private store: Store, private settingsService: ProjectService, private authService: AuthService) {
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
}
