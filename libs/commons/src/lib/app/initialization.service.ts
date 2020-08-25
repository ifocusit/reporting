import { Inject, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { LOCATION_TOKEN } from '../reporting-common.module';
import { ReadSettings, SettingsState } from '../settings/settings.store';
import { setMetaContent } from '../theme/theme.utils';
import { TranslationService } from '../translation/translation.service';

@Injectable()
export class InitializationService {
  constructor(
    private swUpdate: SwUpdate,
    protected store: Store,
    protected authService: AuthService,
    private translate: TranslateService,
    private translationService: TranslationService,
    @Inject(LOCATION_TOKEN) private location: Location
  ) {}

  initialize() {
    this.loadDefaultLang();
    this.updateAppOnUpdatesAvailability();
    this.loadUserDataOnUserSelection();
    this.loadGuiThemeOnThemeSelection();
  }

  private loadDefaultLang(): void {
    this.translationService.loadLang('fr');
  }

  private updateAppOnUpdatesAvailability(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available
        .pipe(
          filter(event => !!event),
          mergeMap(() => this.translate.get('messages.update'))
        )
        .subscribe(message => {
          if (confirm(message)) {
            this.location.reload();
          }
        });
    }
  }

  private loadUserDataOnUserSelection(): void {
    this.authService.user$
      .pipe(
        tap(user => this.translationService.loadLang(user.lang)),
        mergeMap(user => this.store.dispatch(new ReadSettings(user.lastProject)))
      )
      .subscribe();
  }

  private loadGuiThemeOnThemeSelection(): void {
    this.store
      .select(SettingsState.theme)
      .pipe(
        tap(theme => {
          document.getElementsByTagName('body')[0].classList.value = theme;
          setMetaContent('theme-color', theme);
          setMetaContent('apple-mobile-web-app-status-bar-style', theme);
        })
      )
      .subscribe();
  }
}
