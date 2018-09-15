import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';

import {Observable} from "rxjs/internal/Observable";
import {catchError, map, mergeMap} from "rxjs/operators";
import {TimesClientService} from "../../services/times-client.service";
import {GetTimes, GetTimesError, GetTimesSuccess, TimeActionTypes} from "./time.action";
import {Time} from "../../models/time.model";
import {of} from "rxjs/internal/observable/of";

@Injectable()
export class TimeEffects {

    constructor(private timesClient: TimesClientService, private actions$: Actions) {
    }

    @Effect()
    GetTimes$: Observable<Action> = this.actions$
        .pipe(
            ofType<GetTimes>(TimeActionTypes.GET_TIMES),
            mergeMap(action => this.timesClient.getTimes(action.date)),
            map((times: Time[]) => new GetTimesSuccess({times: times})),
            catchError(() => of(new GetTimesError()))
        );
}
