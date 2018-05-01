import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Time} from "../model/time.model";

@Injectable()
export class TimeClient {

  constructor(private http: HttpClient) { }

  get url(): string {
    return `${environment.api}/times`;
  }

  getTimes$(month: string): Observable<Time[]> {
    return this.http.get<Time[]>(`${this.url}/month/${month}`);
  }

  create$(time: string): Observable<Time> {
    return this.http.post<Time>(this.url, {time: time});
  }

  delete$(time: Time): Observable<string> {
    return this.http.delete<string>(`${this.url}/${time.id}`);
  }
}
