import * as moment from 'moment';
import { Duration } from 'moment';
import { Time } from '../model/time.model';

export function CalculateDuration(timbrages: Time[]): Duration {
  let duration = moment.duration();

  if (!timbrages || timbrages.length < 2) {
    // no _times
    return duration;
  }
  // calculate duration by pairs of Timbrage
  splitPairs(timbrages).forEach(pair => {
    duration = duration.add(diff(pair[1], pair[0]));
  });

  return duration;
}

function diff(t1: Time, t0: Time): Duration {
  const difference = moment(t1.time).diff(moment(t0.time));
  return moment.duration(difference);
}

function splitPairs(arr: Array<Time>, ignoreSingle = true): Array<Array<Time>> {
  const pairs = [];
  for (let i = 0; i < arr.length; i += 2) {
    if (arr[i + 1] !== undefined) {
      pairs.push([arr[i], arr[i + 1]]);
    } else if (!ignoreSingle) {
      pairs.push([arr[i]]);
    }
  }
  return pairs;
}
