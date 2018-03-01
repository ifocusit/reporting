import * as moment from 'moment';
import {Duration, Moment} from 'moment';

export class ReportItem {

  constructor(public date: Moment, public duration?: Duration) {
    if (!duration && !this.isWeekend()) {
      this.duration = moment.duration(8, 'hours');
    }
  }

  public isWeekend(): boolean {
    return [6, 0].indexOf(this.date.day()) > -1;
  }
}
