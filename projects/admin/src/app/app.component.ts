import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { DefaultAppComponent } from 'projects/commons/src/lib/app/default-app.component';
import { AuthService } from 'projects/commons/src/lib/auth/auth.service';
import { TranslationService } from 'projects/commons/src/lib/translation/translation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
