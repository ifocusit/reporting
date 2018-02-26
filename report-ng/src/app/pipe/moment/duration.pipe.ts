import {Pipe, PipeTransform} from '@angular/core';
import {Duration} from 'moment';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(value: Duration, args?: any): any {
    return value ? `${('0' + value.hours()).slice(-2)}h${('0' + value.minutes()).slice(-2)}` : '';
  }

}
