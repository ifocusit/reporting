import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class HolidaysService {
  constructor(private httpClient: HttpClient) {}

  holidays$(country: string, year: number, region: string | undefined): Observable<string[]> {
    return this.httpClient.get<string[]>(
      `https://holidays-service.web.app/api/holidays/${country}/${year}${region ? `?region=${region}` : ''}`,
      {
        headers: {
          token: 'test123'
        }
      }
    );
  }
}
