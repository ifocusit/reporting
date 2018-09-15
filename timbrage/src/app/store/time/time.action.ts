import {Action} from '@ngrx/store';
import {Time} from "../../models/time.model";
import {TimeState} from "./time.state";

export enum TimeActionTypes {
    CREATE_TIME = '[Time] CREATE_TIME',
    CREATE_TIME_SUCCESS = '[Time] CREATE_TIME_SUCCESS',
    CREATE_TIME_ERROR = '[Time] CREATE_TIME_ERROR',
    UPDATE_TIME = '[Time] UPDATE_TIME',
    UPDATE_TIME_SUCCESS = '[Time] UPDATE_TIME_SUCCESS',
    EDIT_TIME = '[Time] EDIT_TIME',
    GET_TIMES = '[Time] GET_TIMES',
    GET_TIMES_SUCCESS = '[Time] GET_TIMES_SUCCESS',
    GET_TIMES_ERROR = '[Time] GET_TIMES_ERROR',
}

export class GetTimes implements Action {
    readonly type = TimeActionTypes.GET_TIMES;

    constructor(public date: string) {
    }
}

export class GetTimesSuccess implements Action {
    readonly type = TimeActionTypes.GET_TIMES_SUCCESS;

    constructor(public payload: { times: Time[] }) {
    }
}

export class CreateTime implements Action {
    readonly type = TimeActionTypes.CREATE_TIME;

    constructor(public time: TimeState) {
    }
}

export class EditTime implements Action {
    readonly type = TimeActionTypes.EDIT_TIME;

    constructor(public time: Time) {
    }
}

export class CreateTimeSuccess implements Action {
    readonly type = TimeActionTypes.CREATE_TIME_SUCCESS;

    constructor(public time: TimeState) {
    }
}

export class CreateTimeError implements Action {
    readonly type = TimeActionTypes.CREATE_TIME_ERROR;
}

export class UpdateTime implements Action {
    readonly type = TimeActionTypes.UPDATE_TIME;

    constructor(public time: TimeState) {
    }
}

export class UpdateTimeSuccess implements Action {
    readonly type = TimeActionTypes.UPDATE_TIME_SUCCESS;

    constructor(public time: TimeState) {
    }
}

export class GetTimesError implements Action {
    readonly type = TimeActionTypes.GET_TIMES_ERROR;
}

export type All = GetTimes | GetTimesSuccess | GetTimesError |
    EditTime | CreateTime | CreateTimeSuccess | UpdateTime | UpdateTimeSuccess;
