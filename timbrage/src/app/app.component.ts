import { Component, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';
import * as moment from 'moment';
import { DATE_ISO_FORMAT, TimeAdapter } from './models/time.model';
import { TimesClientService } from './services/times-client.service';
import { from, of } from 'rxjs/index';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  mobileQuery: MediaQueryList;

  constructor(private media: MediaMatcher, private timeClient: TimesClientService) {
    registerLocaleData(localeFr, 'fr', localeFrExtra);
    moment.locale('fr');
  }

  ngOnInit(): void {
    setTimeout(() => this.migrateStorage(), 1000);
  }

  private migrateStorage() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      keys.push(localStorage.key(i));
    }
    from(keys)
      .pipe(
        filter(key => key.match(/\d{4}-\d{2}-\d{2}/g)),
        map(key => localStorage.getItem(key)),
        filter(json => !!json),
        map(json => JSON.parse(json)),
        mergeMap(times => this.timeClient.create(times, true)),
        tap(times => localStorage.removeItem(new TimeAdapter(times[0]).format(DATE_ISO_FORMAT))),
        catchError(() => of(true))
      )
      .subscribe()
      .unsubscribe();
  }
}
