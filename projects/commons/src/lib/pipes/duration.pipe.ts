import { Pipe, PipeTransform } from '@angular/core';
import { Duration } from 'moment';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(value: Duration, ...args): string {
    return value
      ? value
          .toISOString()
          .replace('P', '')
          .replace('T', '')
          .toLocaleLowerCase()
      : '';
  }
}
