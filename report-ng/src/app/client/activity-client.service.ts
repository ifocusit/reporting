import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Activity, ActivityType} from "../model/Activity.model";

@Injectable()
export class ActivityClient {

  private url: string = 'http://localhost:8080/activities';

  constructor(private http: HttpClient) { }

  getActivities$(month: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.url}/month/${month}`);
  }

  saveActivity$(date: string, duration: string, type: ActivityType = ActivityType.WORK): Observable<Activity> {
    return this.http.post<Activity>(this.url, new Activity(date, duration, type));
  }
}
