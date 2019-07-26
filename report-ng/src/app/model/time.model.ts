import * as moment from 'moment';

export const ISO_DATE = 'YYYY-MM-DD';
export const ISO_MONTH = 'YYYY-MM';
export const ISO_DATE_TIME = 'YYYY-MM-DDTHH:mm';
export const ISO_TIME = 'HH:mm';

export interface TimeModel {
  timestamp: number;
}

export class Time {
  public constructor(public time: string, public id?: string) {}

  public getMoment() {
    return moment(this.time);
  }

  public get date() {
    return this.getMoment().format(ISO_DATE);
  }

  public getDateTime(): string {
    return this.getMoment().format(ISO_DATE_TIME);
  }

  public get timestamp() {
    return this.getMoment().valueOf();
  }
}
