import moment = require('moment');

export const ISO_DATE = 'YYYY-MM-DD';
export const ISO_DATE_TIME = 'YYYY-MM-DDTHH:mm';
export const ISO_TIME = 'HH:mm';

export class Time {

  public id: string;

  public constructor(public time: string) {}

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

  public getDateTime(): string {
    return this.getMoment().format(ISO_DATE_TIME);
  }

  public compareTo(time: Time): number {
    return this.getDateTime().localeCompare(time.getDateTime())
  }

  public static from(initial: Time): Time {
    const time = new Time(initial.time);
    time.id = initial.id;
    return time;
  }
}
