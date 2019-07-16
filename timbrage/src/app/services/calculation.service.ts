import { Injectable } from '@angular/core';
import { Time, TimeAdapter } from '../models/time.model';
import * as moment from 'moment';
import { Duration } from 'moment';
import { SettingsService } from './settings.service';
import { Store } from '@ngxs/store';
import { AddTime } from '../store/time.store';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {
  constructor(private settings: SettingsService, private store: Store) {}

  public calculate(timbrages: Array<Time>, manageMissing = true, setMissingToEndOfDay = false): Duration {
    let duration = moment.duration();

    if (!timbrages || timbrages.length == 0) {
      // no times
      return duration;
    }

    // calculate duration by pairs of Timbrage
    this.splitPairs(timbrages, manageMissing, setMissingToEndOfDay).forEach(pair => {
      duration = duration.add(this.diff(pair[1], pair[0]));
    });

    // return moment.duration(timbrages);
    return duration;
  }

  private diff(t1: Time, t0: Time): Duration {
    const diff = new TimeAdapter(t1).getMoment().diff(new TimeAdapter(t0).getMoment());

    return moment.duration(diff);
  }

  private splitPairs(list: Array<Time>, manageMissing = true, setMissingToEndOfDay = false): Array<Array<Time>> {
    const pairs = [];
    for (let i = 0; i < list.length; i += 2) {
      if (list[i + 1] !== undefined) {
        pairs.push([list[i], list[i + 1]]);
      } else if (manageMissing) {
        const timeAdapter = new TimeAdapter(list[i]);
        // the list of timbrages is not odd
        const missing = timeAdapter.copyTimeWithCurrentTime();
        // only if it's not in the today time
        // and the actual time is not before the parameterized end of day
        // if we must set missing report to end of the day (use in calendar view)
        const isToday = moment().isSame(timeAdapter.getDate(), 'day');
        const isAfterParametizedEndOfDay = moment().isAfter(this.settings.getEndOfDay());
        if (setMissingToEndOfDay && (!isToday || isAfterParametizedEndOfDay)) {
          // set time to end of day
          missing.time = this.settings
            .applyEndOfDay(moment(list[i].time))
            .startOf('minute')
            .format();

          if (this.settings.get().saveMissings) {
            //   missing timbrage must be save to database
            this.store.dispatch(new AddTime(missing));
          }
        }
        pairs.push([list[i], missing]);
      }
    }
    return pairs;
  }
}
