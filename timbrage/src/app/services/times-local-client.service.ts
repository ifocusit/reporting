import {Injectable} from "@angular/core";
import {Observable} from "rxjs/internal/Observable";
import {DATE_ISO_FORMAT, Time, TimeAdapter} from "../models/time.model";
import {filter, map, mergeMap, switchMap, tap, toArray} from "rxjs/operators";
import {v4 as uuid} from 'uuid';
import {from, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TimesLocalClientService {

    constructor() {
    }

    public read(date: string): Observable<Time[]> {
        if (date.length > 7) {
            return this.readDay(date);
        }
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            keys.push(localStorage.key(i));
        }
        return from(keys)
            .pipe(
                filter((key: string) => key.startsWith(date)),
                mergeMap((day: string) => this.readDay(day))
            );
    }

    private readDay(day: string): Observable<Time[]> {
        return of(localStorage.getItem(day))
            .pipe(
                tap(store => console.log(store)),
                map(store => store || '[]'),
                map(json => JSON.parse(json)),
                switchMap(array => from(array)),
                map((value: { id: string, time: string }) => new Time(value.time, value.id)),
                toArray()
            );
    }

    public create(time: Time): Observable<Time> {
        time.id = uuid();
        const key = this.getKey(time);
        return this.read(key)
            .pipe(
                tap(values => values.push(time)),
                this.save(key),
                map(() => time)
            );
    }

    private getKey(time: Time) {
        return new TimeAdapter(time).getMoment().format(DATE_ISO_FORMAT);
    }

    public update(time: Time): Observable<Time> {
        const key = this.getKey(time);
        return this.read(key)
            .pipe(
                this.remove(time),
                tap(values => values.push(time)),
                this.save(key),
                map(() => time)
            );
    }

    public delete(time: Time): Observable<any> {
        const key = this.getKey(time);
        return this.read(key)
            .pipe(
                this.remove(time),
                this.save(key)
            );
    }

    private save = (key: string) => (source: Observable<Time[]>) =>
        source.pipe(
            map(values => JSON.stringify(values)),
            tap(json => console.log(json)),
            tap(json => localStorage.setItem(key, json))
        );

    private remove = (time: Time) => (source: Observable<Time[]>) => source.pipe(map(values => values.filter(value => value.id !== time.id)));
}
