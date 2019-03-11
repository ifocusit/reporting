import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DATE_ISO_FORMAT, MONTH_ISO_FORMAT, Time, TimeAdapter } from '../models/time.model';
import { defaultIfEmpty, filter, map, mergeMap, tap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { from } from 'rxjs';
import * as _ from 'lodash';
import { LocalStorage } from '@ngx-pwa/local-storage';
import * as moment from 'moment';
import { TimesClientService } from './times-client.service';

@Injectable({
  providedIn: 'root',
})
export class TimesLocalClientService extends TimesClientService {
  constructor(private storage: LocalStorage) {
    super(null);
  }

  public read(date: string): Observable<Time[]> {
    if (date.length > MONTH_ISO_FORMAT.length) {
      return this.readDay(date);
    }
    const localDate = moment(date).date(1);
    const daysInMonth = localDate.daysInMonth();
    const keys = [];
    for (let i = 0; i < daysInMonth; i++) {
      keys.push(moment(localDate).format(DATE_ISO_FORMAT));
      localDate.add(1, 'days');
    }
    return from(keys).pipe(mergeMap((day: string) => this.readDay(day)));
  }

  private readDay(key: string): Observable<Time[]> {
    return this.storage.getItem(key).pipe(
      filter(data => !!data),
      defaultIfEmpty([])
    );
  }

  public create(times: Time[], uniq = false): Observable<Time[]> {
    const byKey = _.chain(times)
      .forEach(time => (time.id = uuid()))
      .groupBy(time => getKey(time))
      .map((elt, index) => ({ key: index, values: elt }))
      .value();
    return from(byKey).pipe(
      mergeMap(day => this.readDay(day.key).pipe(map(values => [...values, ...day.values]))),
      map(times => (uniq ? _.uniqBy(times, 'time') : times)),
      mergeMap((times: Time[]) => this.storage.setItem(getKey(times[0]), times).pipe(map(() => times)))
    );
  }

  public update(time: Time): Observable<Time> {
    const key = getKey(time);
    return this.readDay(key).pipe(
      this.remove(time),
      tap(values => values.push(time)),
      mergeMap(json => this.storage.setItem(key, json)),
      map(() => time)
    );
  }

  public delete(time: Time): Observable<boolean> {
    const key = getKey(time);
    return this.readDay(key).pipe(
      this.remove(time),
      mergeMap(json => this.storage.setItem(key, json))
    );
  }

  private remove = (time: Time) => (source: Observable<Time[]>) => source.pipe(map(values => values.filter(value => value.id !== time.id)));
}

const getKey = (time: Time) => new TimeAdapter(time).format(DATE_ISO_FORMAT);
