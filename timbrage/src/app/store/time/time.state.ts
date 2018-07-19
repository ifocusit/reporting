import {Time} from "../../models/time.model";

export class TimeState extends Time {
}

export const initializeTimeState = function () {
  return {}
};

export interface TimeListState {
  times: TimeState[];
  loading: boolean;
  pending: number;
}

export const intializeTimeListState = function () {
  return {
    loading: false,
    pending: 0,
  }
};