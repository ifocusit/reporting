import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Duration, unitOfTime } from 'moment';

@Pipe({
  name: 'duration',
  pure: true
})
export class DurationPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  public static clean(duration: Duration) {
    return duration
      .clone()
      .subtract(duration.seconds(), 'seconds')
      .subtract(duration.milliseconds(), 'milliseconds');
  }

  transform(duration: Duration, unit: unitOfTime.Base): string | number {
    if (!duration) {
      return '';
    }
    duration = DurationPipe.clean(duration);
    return unit ? this.as(duration, unit) : this.toString(duration);
  }

  private as(duration: Duration, unit: unitOfTime.Base) {
    return this.decimalPipe.transform(duration.as(unit), '.2-2');
  }

  private toString(duration: Duration) {
    return duration
      .toISOString()
      .replace('P', '')
      .replace('T', '')
      .replace('0D', '-')
      .toLocaleLowerCase();
  }
}
