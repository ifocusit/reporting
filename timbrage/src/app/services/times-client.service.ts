import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Time} from "../models/time.model";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class TimesClientService {

    constructor(private http: HttpClient) {
    }

    public getTimes(date: string): Observable<Time[]> {
        return this.http.get<Time[]>(`${environment.client.base_url}/times/date/${date}`)
    }
}
