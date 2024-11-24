import { Pipe, PipeTransform } from '@angular/core';
import moment, { Moment } from 'moment';

@Pipe({
  name: 'moment',
  pure: true
})
export class MomentPipe implements PipeTransform {
  transform(value: Moment | string, format = 'HH:mm') {
    if (typeof value === 'string') {
      value = moment(value);
    }
    return value ? value.format(format) : '';
  }
}
