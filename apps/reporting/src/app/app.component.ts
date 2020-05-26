import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AuthService, DefaultAppComponent, TranslationService } from '@ifocusit/commons';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';

@Component({
  selector: 'ifocusit-root',
  template: `<main role="main"><router-outlet></router-outlet></main>`,
  styles: [
    `
      @media print {
        mat-toolbar {
          display: none;
        }
      }
    `
  ]
})
export class AppComponent extends DefaultAppComponent {
  constructor(
    swUpdate: SwUpdate,
    store: Store,
    authService: AuthService,
    translate: TranslateService,
    translationService: TranslationService
  ) {
    super(swUpdate, store, authService, translate, translationService);
  }
}
