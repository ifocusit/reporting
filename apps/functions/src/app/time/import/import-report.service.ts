import { Injectable } from '@angular/core';
import { flatten } from 'lodash';
import * as moment from 'moment';
import { Duration, Moment } from 'moment';

@Injectable()
export class ImportReportService {
  constructor() {}

  public parse(fileContent: string): Promise<string[]> {
    return Promise.resolve(
      flatten(
        fileContent
          .split(/\r?\n/g)
          .slice(1)
          .map(line => this.parseLine(line))
      )
    );
  }

  private parseLine(line: string): string[] {
    if (this.isAReportLine(line)) {
      const columns = line.split(',');
      const date = moment(columns[0], 'DD/MM/YYYY').utc(true);
      const workHours = moment.duration(columns[3]);
      if (workHours.asMinutes() > 0) {
        return this.totalToTimes(date, workHours);
      }
    }
    return [];
  }

  private totalToTimes(date: Moment, duration: Duration): string[] {
    const endOfDay = date
      .clone()
      .set('hours', 8 + duration.hours())
      .set('minutes', duration.minutes());
    return [date.clone().set('hours', 8), endOfDay].map(time => time.toISOString());
  }

  private isAReportLine(line: string) {
    return line.match(/\d{2}\/\d{2}\/\d{4},.*/g);
  }
}
