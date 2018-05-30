import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Activity, ActivityType} from "../model/activity.model";
import {environment} from "../../environments/environment";

@Injectable()
export class ActivityClient {

  constructor(private http: HttpClient) { }

  get url(): string {
    return `${environment.api}/activities`;
  }

  getActivities$(month: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.url}/month/${month}`);
  }

  saveActivity$(date: string, duration: string, type: ActivityType = ActivityType.WORK): Observable<Activity> {
    return this.http.post<Activity>(this.url, new Activity(date, duration, type));
  }
}
