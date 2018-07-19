import {Action} from '@ngrx/store';
import {TimeState} from "./time.state";

export const GET_TIMES = '[Time] GET_TIMES';
export const GET_TIMES_SUCCESS = '[Time] GET_TIMES_SUCCESS';
export const GET_TIMES_ERROR = '[Time] GET_TIMES_ERROR';

export class GetTimes implements Action {
  readonly type = GET_TIMES;
}

export class GetTimesSuccess implements Action {
  readonly type = GET_TIMES_SUCCESS;

  constructor(public payload: TimeState[]) {}
}

export class GetTimesError implements Action {
  readonly type = GET_TIMES_ERROR;
}

export type All = GetTimes | GetTimesSuccess | GetTimesError;
