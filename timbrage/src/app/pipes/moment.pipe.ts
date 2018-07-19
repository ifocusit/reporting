import {Pipe, PipeTransform} from '@angular/core';
import {Moment} from 'moment';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(value: Moment, format = 'HH:mm'): any {
    return value ? value.format(format) : '';
  }
}
