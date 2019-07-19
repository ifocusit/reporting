import { Pipe, PipeTransform } from '@angular/core';
import { Duration } from 'moment';
import * as moment from 'moment';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(value: Duration | string): any {
    const duration = moment.duration(value);
    return value ? `${('0' + duration.hours()).slice(-2)}:${('0' + duration.minutes()).slice(-2)}` : duration.toISOString();
  }
}
