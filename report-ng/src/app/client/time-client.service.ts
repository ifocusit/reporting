import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Time} from "../model/time.model";
import {map} from "rxjs/operators";

@Injectable()
export class TimeClient {

  private static cast = (created) => Time.from(created);

  constructor(private http: HttpClient) { }

  get url(): string {
    return `${environment.api}/times`;
  }

  getTimes$(month: string): Observable<Time[]> {
    return this.http.get<Time[]>(`${this.url}/month/${month}`)
      .pipe(
        map((times: Time[]) => times.map(TimeClient.cast))
      );
  }

  create$(time: string): Observable<Time> {
    return this.http.post<Time>(this.url, {time: time})
      .pipe(
        map(TimeClient.cast)
      );
  }

  delete$(time: Time): Observable<string> {
    return this.http.delete<string>(`${this.url}/${time.id}`);
  }
}
