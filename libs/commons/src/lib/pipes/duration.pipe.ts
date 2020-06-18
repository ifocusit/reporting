import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Duration, unitOfTime } from 'moment';

@Pipe({
  name: 'duration',
  pure: true
})
export class DurationPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  public static clean(duration: Duration) {
    return duration.clone().subtract(duration.seconds(), 'seconds').subtract(duration.milliseconds(), 'milliseconds');
  }

  public static format(duration: Duration, zeroFormat: string = '-') {
    return duration.toISOString().replace('P', '').replace('T', '').replace('0D', zeroFormat).toLocaleLowerCase();
  }

  transform(duration: Duration | string, unit: unitOfTime.Base): string | number {
    if (!duration) {
      return '';
    }
    if (typeof duration === 'string') {
      duration = moment.duration(duration);
    }
    duration = DurationPipe.clean(duration);
    return unit ? this.as(duration, unit) : DurationPipe.format(duration);
  }

  private as(duration: Duration, unit: unitOfTime.Base) {
    return this.decimalPipe.transform(duration.as(unit), '.2-2');
  }
}
