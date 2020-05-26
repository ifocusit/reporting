import { OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { ReadSettings, SettingsState } from '../settings/settings.store';
import { setMetaContent } from '../theme/theme.utils';
import { TranslationService } from '../translation/translation.service';

export abstract class DefaultAppComponent implements OnInit {
  constructor(
    private swUpdate: SwUpdate,
    protected store: Store,
    protected authService: AuthService,
    private translate: TranslateService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
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
