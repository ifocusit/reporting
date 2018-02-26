import * as moment from 'moment';
import {Duration, Moment} from 'moment';

export class ReportItem {

  constructor(public date: Moment, public duration: Duration = moment.duration(8, 'hours')) {
  }
}
