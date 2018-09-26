import {Injectable} from "@angular/core";
import {Observable} from "rxjs/internal/Observable";
import {Time} from "../models/time.model";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class TimesClientService {

    constructor(private http: HttpClient) {
    }

    public read(date: string): Observable<Time[]> {
        return this.http.get<Time[]>(`${environment.client.base_url}/times/date/${date}`)
    }

    public create(time: Time): Observable<Time> {
        return this.http.post<Time>(`${environment.client.base_url}/times`, time);
    }

    public update(time: Time): Observable<Time> {
        return this.http.put<Time>(`${environment.client.base_url}/times/${time.id}`, time);
    }

    public delete(time: Time): Observable<any> {
        return this.http.delete<any>(`${environment.client.base_url}/times/${time.id}`);
    }
}
