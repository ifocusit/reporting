import * as moment from 'moment';
import {Duration, Moment} from 'moment';

export class ReportItem {

  constructor(public date: Moment, public duration?: string) {
    if (!duration && !this.isWeekend()) {
      this.duration = 'PT8H';
    }
  }

  public getDuration(): Duration {
    return this.duration ? moment.duration(this.duration) : null;
  }

  public isWeekend(): boolean {
    return [6, 0].indexOf(this.date.day()) > -1;
  }

  public isSameDate(date: string): boolean {
    return this.date.format('YYYY-MM-DD') === date;
  }
}
