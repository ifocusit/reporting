import { Pipe, PipeTransform } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {
  transform(value: Moment | string, format = 'HH:mm'): any {
    if (typeof value === 'string') {
      value = moment(value);
    }
    return value ? value.format(format) : '';
  }
}
