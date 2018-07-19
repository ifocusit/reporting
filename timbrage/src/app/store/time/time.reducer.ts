import {initializeTimeState, TimeListState, TimeState} from "./time.state";
import * as TimeActions from './time.action';

export type Action = TimeActions.All;

const defaultTimeStates: TimeState[] = [
  <TimeState>{
    ...initializeTimeState()
  }
];

const defaultState: TimeListState = {
  times: defaultTimeStates,
  loading: false,
  pending: 0
};


export function TimeReducer(state = defaultState, action: Action) {
  console.log(state, action);

  switch (action.type) {

    case TimeActions.GET_TIMES: {
      return {...state, loaded: false, loading: true};
    }

    case TimeActions.GET_TIMES_SUCCESS: {

      return {
        ...state,
        times: [
          ...action.payload,
          defaultTimeStates[0]
        ],
        loading: false
      };
    }

    default: {
      return state;
    }
  }
}