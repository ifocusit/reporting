import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeEnExtra from '@angular/common/locales/extra/en';
import localeFrExtra from '@angular/common/locales/extra/fr';
import localeFr from '@angular/common/locales/fr';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(private translate: TranslateService) {}

  public loadLang(lang: string) {
    registerLocaleData(lang === 'en' ? localeEn : localeFr, lang, lang === 'en' ? localeEnExtra : localeFrExtra);
    moment.locale(lang);
    this.translate.setDefaultLang(lang);
  }
}
