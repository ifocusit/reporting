import {Injectable} from '@angular/core';
import {Time, TimeAdapter} from "../models/time.model";
import * as moment from 'moment';
import {Duration} from 'moment';
import {SettingsService} from "./settings.service";

@Injectable({
    providedIn: 'root'
})
export class CalculationService {

    constructor(private settings: SettingsService) {
    }

    public calculate(timbrages: Array<Time>): Promise<Duration> {
        return Promise.resolve().then(() => {
            let duration = moment.duration();

            if (!timbrages || timbrages.length == 0) {
                // no times
                return duration;
            }

            // calculate duration by pairs of Timbrage
            this.splitPairs(timbrages).forEach(pair => {
                duration = duration.add(this.diff(pair[1], pair[0]));
            });

            // return moment.duration(timbrages);
            return duration;
        });
    }

    public diff(t1: Time, t0: Time): Duration {
        let diff = new TimeAdapter(t1).getMoment().diff(new TimeAdapter(t0).getMoment());

        return moment.duration(diff);
    }

    public splitPairs(list: Array<Time>, endOfDay = false): Array<Array<Time>> {
        const pairs = [];
        for (let i = 0; i < list.length; i += 2) {
            if (list[i + 1] !== undefined) {
                pairs.push([list[i], list[i + 1]]);
            } else {
                // the list of timbrages is not odd
                let missing = new Time();
                // if we must set missing report to end of the day (use in calendar view)
                // only if it's not in the today time
                // and the actual time is not before the parameterized end of day
                let isToday = moment().isSame(new TimeAdapter(list[i]).getDate(), "day");
                let isAfterParametizedEndOfDay = moment().isAfter(this.settings.getEndOfDay());
                if (endOfDay && (!isToday || isAfterParametizedEndOfDay)) {
                    // set time to end of day
                    missing.time = this.settings.applyEndOfDay(moment(list[i].time)).startOf('minute').format();

                    // if (this.settings.get().saveMissings) {
                    //   missing timbrage must be save to database
                    // this.storage.saveSync(missing).then((timbrage) => missing = timbrage[0]);
                    // }
                }
                pairs.push([list[i], missing]);
            }
        }
        return pairs;
    };
}
