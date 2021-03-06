import * as moment from 'moment';
import { Duration, Moment } from 'moment';
import { CalculateDuration } from './calculate-duration.tools';
import { DATETIME_ISO_FORMAT, DATE_ISO_FORMAT, Time, TimeAdapter, TIME_ISO_FORMAT } from './time.model';

export class WorkingDateReporting {
  public hasTimes: boolean;
  public isWeekend: boolean;
  public isNotComplete: boolean;
  public isHoliday: boolean;
  public isDayOff: boolean;
  public duration: Duration;

  constructor(public date: Moment, public times: Time[] = [], daysOff: string[] = []) {
    this.isWeekend = [6, 0].includes(date.day());
    this.hasTimes = times && times.length > 0;
    this.isNotComplete = times.length % 2 !== 0;

    this.duration = CalculateDuration(this.times);

    // les jours vides et avant le jour en cours sont marqué comme congé
    this.isHoliday = !this.hasTimes && !this.isWeekend && this.date.isBefore(moment().startOf('day'));

    this.isDayOff = daysOff.includes(date.format(DATE_ISO_FORMAT));
  }

  public getDatetime(index: number): Moment {
    return new TimeAdapter(this.times[index]).getMoment();
  }

  public isSameDate(date: string): boolean {
    return this.date.format(DATE_ISO_FORMAT) === date;
  }

  public get off() {
    return this.isDayOff || this.isHoliday || this.isWeekend;
  }
}

function time(value: string): Time {
  return TimeAdapter.createTime(moment(value, TIME_ISO_FORMAT).format(DATETIME_ISO_FORMAT));
}
