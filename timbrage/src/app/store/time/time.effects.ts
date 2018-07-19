import {environment} from '../../../environments/environment';
import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {Actions, Effect} from '@ngrx/effects';

import * as TimeActions from './time.action';

import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs/internal/Observable";
import {TimeState} from "./time.state";
import {catchError, map, mergeMap} from "rxjs/operators";
import {of} from "rxjs/internal/observable/of";

@Injectable()
export class TimeEffects {

  constructor(private http: HttpClient, private actions$: Actions) {
  }

  @Effect()
  GetTimes$: Observable<Action> = this.actions$.ofType<TimeActions.GetTimes>(TimeActions.GET_TIMES)
    .pipe(
      mergeMap(() =>
        this.http.get<TimeState[]>(environment.client.base_url + '/times')
          .pipe(
            map((times: TimeState[]) => new TimeActions.GetTimesSuccess(times)),
            catchError(() => of(new TimeActions.GetTimesError()))
          )
      )
    );
}
