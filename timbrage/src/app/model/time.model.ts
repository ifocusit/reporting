import * as moment from "moment";

export class Time {
  constructor(public date = moment()) {
  }

  get hours(): number {
    return this.date.hours();
  }

  set hours(hour: number) {
    this.date.hours(hour);
  }

  get minutes(): number {
    return this.date.minutes();
  }

  set minutes(minute: number) {
    this.date.minutes(minute);
  }
}
