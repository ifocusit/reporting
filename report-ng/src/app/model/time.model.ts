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

  public static from(initial: Time): Time {
    return new Time(initial.time, initial.id);
  }

  public clone(): Time {
    return new Time(this.time);
  }

  public getMoment() {
    return moment(this.time);
  }

  public hasId(): boolean {
    return !!this.id;
  }

  public getDate(): string {
    return this.getMoment().format(ISO_DATE);
  }

  public get date() {
    return this.getDate();
  }

  public getDateTime(): string {
    return this.getMoment().format(ISO_DATE_TIME);
  }

  public compareTo(time: Time): number {
    return this.getDateTime().localeCompare(time.getDateTime());
  }

  public get timestamp() {
    return this.getMoment().valueOf();
  }
}
