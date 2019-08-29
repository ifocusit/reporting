import { Pipe, PipeTransform } from '@angular/core';
import { Duration, unitOfTime } from 'moment';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(duration: Duration, unit: unitOfTime.Base): string | number {
    return duration ? (unit ? this.as(duration, unit) : this.toString(duration)) : '';
  }

  private as(duration: Duration, unit: unitOfTime.Base) {
    return this.decimalPipe.transform(duration.as(unit), '.2-2');
  }

  private toString(duration: Duration) {
    return duration
      .toISOString()
      .replace('P', '')
      .replace('T', '')
      .toLocaleLowerCase();
  }
}
