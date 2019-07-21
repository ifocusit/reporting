import * as moment from 'moment';
import { Duration, Moment } from 'moment';
import { ISO_DATE, ISO_DATE_TIME, ISO_TIME, Time } from './time.model';
import { CalculateDuration } from '../service/calculate-duration.tools';

export class WorkingDateReporting {
  constructor(public date: Moment, public times: Time[] = [], public holiday = false) {}

  get duration(): Duration {
    return CalculateDuration(this.times);
  }

  getDatetime(index: number): Moment {
    return this.times[index].getMoment();
  }

  public get isWeekend(): boolean {
    return [6, 0].indexOf(this.date.day()) > -1;
  }

  public isSameDate(date: string): boolean {
    return this.date.format(ISO_DATE) === date;
  }

  get hasTimes(): boolean {
    return this.times && this.times.length > 0;
  }

  get isNotComplete(): boolean {
    return this.times.length % 2 !== 0;
  }
}

function time(value: string): Time {
  return new Time(moment(value, ISO_TIME).format(ISO_DATE_TIME));
}

export const DEFAULT_DAY_DURATION = 8;
export const WEEK_OVERTIME_MAJOR = 1.2;
export const DEFAULT_TIME = new WorkingDateReporting(moment(), [time('08:00'), time('11:30'), time('12:30'), time('17:00')]);
