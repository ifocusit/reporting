import { Injectable } from '@angular/core';
import { Time, TimeAdapter } from './time.model';
import * as moment from 'moment';
import { Duration } from 'moment';
import { Store } from '@ngxs/store';
import { AddTime } from './time.store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Moment } from 'moment';
import { Settings } from '../settings/settings.model';
import { ProjectService } from '../settings/project.service';
import { SettingsState } from '../settings/settings.store';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {
  private getEndOfDay = (settings: Settings): Moment => settings.timbrage.defaults.map(time => moment(time, 'HH:mm')).pop();

  constructor(private projectService: ProjectService, private store: Store) {}

  public calculate(timbrages: Array<Time>, manageMissing = true, setMissingToEndOfDay = false): Observable<Duration> {
    return this.store
      .select(SettingsState.settings)
      .pipe(map(settings => this._calculate(timbrages, settings, manageMissing, setMissingToEndOfDay)));
  }

  private _calculate(timbrages: Array<Time>, settings: Settings, manageMissing = true, setMissingToEndOfDay = false): Duration {
    let duration = moment.duration();

    if (!timbrages || timbrages.length === 0) {
      // no times
      return duration;
    }

    // calculate duration by pairs of Timbrage
    this.splitPairs(timbrages, settings, manageMissing, setMissingToEndOfDay).forEach(pair => {
      duration = duration.add(this.diff(pair[1], pair[0]));
    });

    // return moment.duration(timbrages);
    return duration;
  }

  private diff(t1: Time, t0: Time): Duration {
    const diff = new TimeAdapter(t1).getMoment().diff(new TimeAdapter(t0).getMoment());

    return moment.duration(diff);
  }

  private splitPairs(list: Array<Time>, settings: Settings, manageMissing = true, setMissingToEndOfDay = false): Array<Array<Time>> {
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
        const isAfterParametizedEndOfDay = moment().isAfter(this.applyEndOfDay(settings));
        if (setMissingToEndOfDay && (!isToday || isAfterParametizedEndOfDay)) {
          // set time to end of day
          missing.time = this.applyEndOfDay(settings, moment(list[i].time))
            .startOf('minute')
            .format();

          if (settings.timbrage.saveMissings) {
            //   missing timbrage must be save to database
            this.store.dispatch(new AddTime(missing));
          }
        }
        pairs.push([list[i], missing]);
      }
    }
    return pairs;
  }

  private applyEndOfDay(settings: Settings, date: Moment = moment()): Moment {
    const endOfDay = this.getEndOfDay(settings);
    return date.startOf('day').set({ hour: endOfDay.hour(), minute: endOfDay.minute() });
  }
}
