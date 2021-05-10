import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth';

@Injectable()
export class HolidaysService {
  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  holidays$(country: string, year: number, region: string | undefined): Observable<string[]> {
    return this.authService.user$.pipe(
      map(user => user.uid),
      switchMap(uid =>
        this.httpClient.get<string[]>(
          `https://holidays-service.web.app/api/holidays/${country}/${year}${region ? `?region=${region}` : ''}`,
          {
            headers: {
              token: uid
            }
          }
        )
      ),
      catchError(() => [])
    );
  }
}
