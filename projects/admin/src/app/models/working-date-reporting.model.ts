import * as moment from 'moment';
import { Duration, Moment } from 'moment';
import { CalculateDuration } from 'projects/commons/src/lib/times/calculate-duration.tools';
import { Time, TimeAdapter, DATE_ISO_FORMAT, DATETIME_ISO_FORMAT, TIME_ISO_FORMAT } from 'projects/commons/src/lib/times/time.model';

export class WorkingDateReporting {
  constructor(public date: Moment, public times: Time[] = [], public isHoliday = false) {}

  get duration(): Duration {
    return CalculateDuration(this.times);
  }

  getDatetime(index: number): Moment {
    return new TimeAdapter(this.times[index]).getMoment();
  }

  public get isWeekend(): boolean {
    return [6, 0].indexOf(this.date.day()) > -1;
  }

  public isSameDate(date: string): boolean {
    return this.date.format(DATE_ISO_FORMAT) === date;
  }

  get hasTimes(): boolean {
    return this.times && this.times.length > 0;
  }

  get isNotComplete(): boolean {
    return this.times.length % 2 !== 0;
  }
}

function time(value: string): Time {
  return TimeAdapter.createTime(moment(value, TIME_ISO_FORMAT).format(DATETIME_ISO_FORMAT));
}

export const DEFAULT_DAY_DURATION = 8;
export const WEEK_OVERTIME_MAJOR = 1.2;
