import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';
import * as moment from 'moment';
import { DATE_ISO_FORMAT, TimeAdapter } from './models/time.model';
import { TimesClientService } from './services/times-client.service';
import { from, of } from 'rxjs/index';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  mobileQuery: MediaQueryList;

  constructor(private timeClient: TimesClientService, private swUpdate: SwUpdate) {
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
        mergeMap(times => this.timeClient.create(times)),
        tap(times => localStorage.removeItem(new TimeAdapter(times[0]).format(DATE_ISO_FORMAT))),
        catchError(() => of(true))
      )
      .subscribe()
      .unsubscribe();
  }
}
