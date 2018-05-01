import moment = require('moment');

export class Time {

  public id: string;

  public constructor(public time: string) {}

  public clone(): Time {
    return new Time(this.time);
  }
}
