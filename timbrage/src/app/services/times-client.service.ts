import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Time } from '../models/time.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TimesClientService {
  constructor(private http: HttpClient) {}

  public read(date: string): Observable<Time[]> {
    return this.http.get<Time[]>(`/api/times/date/${date}`);
  }

  public create(times: Time[]): Observable<Time[]> {
    return from(times).pipe(
      mergeMap(time => this.http.post<Time>(`/api/times`, time)),
      toArray()
    );
  }

  public update(time: Time): Observable<Time> {
    return this.http.put<Time>(`/api/times/${time.id}`, time);
  }

  public delete(time: Time): Observable<any> {
    return this.http.delete<any>(`/api/times/${time.id}`);
  }
}
