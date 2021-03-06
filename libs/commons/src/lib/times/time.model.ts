import * as moment from 'moment';
import { Moment } from 'moment';

export const DATETIME_ISO_FORMAT = 'YYYY-MM-DDTHH:mm';
export const DATE_ISO_FORMAT = 'YYYY-MM-DD';
export const MONTH_ISO_FORMAT = 'YYYY-MM';
export const TIME_ISO_FORMAT = 'HH:mm';

export interface TimeModel {
  timestamp: number;
}

export interface Time {
  time: string;
  id?: string;
}

export class TimeAdapter {
  constructor(private innertime: Time) {}

  public static createTime(time: string | Moment = moment(), id?: string): Time | null {
    time = moment(time).startOf('minutes');
    if (!time.isValid()) {
      return null;
    }
    return {
      id,
      time: time.format(DATETIME_ISO_FORMAT)
    };
  }

  get time() {
    return this.innertime;
  }

  public getDate(): Date {
    return new Date(this.innertime.time);
  }

  public getMoment(): Moment {
    return moment(this.innertime.time);
  }

  get hours(): number {
    return this.getMoment().hours();
  }

  set hours(hour: number) {
    this.innertime.time = this.getMoment()
      .hours(hour)
      .format(DATETIME_ISO_FORMAT);
  }

  get minutes(): number {
    return this.getMoment().minutes();
  }

  set minutes(minute: number) {
    this.innertime.time = this.getMoment()
      .minutes(minute)
      .format(DATETIME_ISO_FORMAT);
  }

  public getMonth(): string {
    return this.format(MONTH_ISO_FORMAT);
  }

  public getDay(): string {
    return this.format(DATE_ISO_FORMAT);
  }

  public format(format = DATETIME_ISO_FORMAT) {
    return this.getMoment().format(format);
  }

  public get timestamp() {
    return this.getMoment().valueOf();
  }

  public copyTimeWithCurrentTime(): Time {
    const time = this.getMoment();
    const now = moment();
    time.hours(now.hours());
    time.minutes(now.minutes());
    return { time: time.format(DATETIME_ISO_FORMAT) };
  }
}
