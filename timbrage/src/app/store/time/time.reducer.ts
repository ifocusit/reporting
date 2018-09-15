import {adapter, TimeState} from "./time.state";
import * as TimeActions from './time.action';
import {TimeActionTypes} from './time.action';
import {createFeatureSelector, createSelector} from "@ngrx/store";
import * as moment from "moment";

export type Action = TimeActions.All;

export const initialTimesState = adapter.getInitialState();

export function timesReducer(state = initialTimesState, action: Action) {
    console.log(state, action);
    switch (action.type) {

        case TimeActionTypes.GET_TIMES: {
            return {...state, loaded: false};
        }

        case TimeActionTypes.GET_TIMES_SUCCESS: {
            return adapter.addAll(action.payload.times, {...state, loaded: true});
        }

        // case TimeActions.EDIT_TIME: {
        //     return {
        //         ...state,
        //         times: state.times.map(time => {
        //             if (time.time === action.time.time) {
        //                 time.editing = true;
        //                 time.saving = false;
        //             }
        //             return time;
        //         })
        //     }
        // }

        // case TimeActions.CREATE_TIME: {
        //     return {
        //         ...state,
        //         times: state.times.map(time => {
        //             if (time.time === action.time.time) {
        //                 time.saving = false;
        //                 time.editing = false;
        //             }
        //             return time;
        //         })
        //     }
        // }

        // case TimeActions.CREATE_TIME_SUCCESS: {
        //     return {
        //         ...state,
        //         times: state.times.map(time => {
        //             if (time.time === action.time.time) {
        //                 time.saving = true;
        //                 time.editing = false;
        //             }
        //             return time;
        //         })
        //     }
        // }

        default: {
            return state;
        }
    }
}

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal

} = adapter.getSelectors();


export const selectTimesState = createFeatureSelector<TimeState>("times");

export const selectAllTimes = createSelector(
    selectTimesState,
    selectAll
);

export const selectCurrentMonthTimes = createSelector(
    selectAllTimes,
    times => times.filter(time => time.getMoment().isSame(moment().startOf('month'), 'm'))
);

export const selectTodayTimes = createSelector(
    selectAllTimes,
    times => times.filter(time => time.getMoment().isSame(moment().startOf('day'), 'd'))
);
