import { registerLocaleData } from '@angular/common';
import localeFrExtra from '@angular/common/locales/extra/fr';
import localeFr from '@angular/common/locales/fr';
import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Select, Store } from '@ngxs/store';
import * as moment from 'moment';
import { AuthService } from 'projects/commons/src/lib/auth/auth.service';
import { ProjectService } from 'projects/commons/src/lib/settings/project.service';
import { ReadSettings, SettingsState } from 'projects/commons/src/lib/settings/settings.store';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Select(SettingsState.project)
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
    this.authService.user$.pipe(mergeMap(user => this.store.dispatch(new ReadSettings(user.lastProject)))).subscribe();

    // changement de theme
    this.store
      .select(SettingsState.theme)
      .pipe(tap(theme => (document.getElementsByTagName('body')[0].classList.value = theme)))
      .subscribe();
  }
}
