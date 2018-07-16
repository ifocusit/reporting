import * as moment from "moment";
import {Moment} from "moment";

export class Time {
  constructor(public date: string = moment().startOf('minute').format()) {
  }

  public getDate(): Date {
    return new Date(this.date);
  }

  public getMoment(): Moment {
    return moment(this.date);
  }

  get hours(): number {
    return this.getMoment().hours();
  }

  set hours(hour: number) {
    this.date = this.getMoment().hours(hour).format();
  }

  get minutes(): number {
    return this.getMoment().minutes();
  }

  set minutes(minute: number) {
    this.date = this.getMoment().minutes(minute).format();
  }
}
