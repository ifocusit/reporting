import * as moment from "moment";
import {Duration, Moment} from "moment";
import {ISO_DATE, ISO_DATE_TIME, ISO_TIME, Time} from "./time.model";

export class WorkingDateReporting {

    constructor(public date: Moment, public _times?: Time[]) {
        if (!_times && !this.isWeekend()) {
            this.withDefaultTimes();
        }
    }

    withDefaultTimes(): WorkingDateReporting {
        const date = this.date.clone();
        this._times = [
            new Time(date.set({'hour': 8, 'minute': 0}).format(ISO_DATE_TIME)),
            new Time(date.set({'hour': 11, 'minute': 30}).format(ISO_DATE_TIME)),
            new Time(date.set({'hour': 12, 'minute': 30}).format(ISO_DATE_TIME)),
            new Time(date.set({'hour': 17, 'minute': 0}).format(ISO_DATE_TIME))
        ];
        return this;
    }

    public push(time: Time) {
        this._times.push(time);
        this._times.sort((a: Time, b: Time) => a.compareTo(b));
    }

    get times() {
        return this._times;
    }

    set times(times: Time[]) {
        this._times = times ? times.sort((a: Time, b: Time) => a.compareTo(b)) : times;
    }

    getDatetime(index: number): Moment {
        return this._times[index].getMoment();
    }

    getDuration(): Duration {
        return CalculateDuration(this._times);
    }

    get duration(): string {
        const duration = this.getDuration();
        return !duration ? '' : duration.toISOString();
    }

    set duration(sDuration: string) {
        const duration = moment.duration(sDuration);
        const date = this.date.clone();
        let diff = duration.asHours() - DEFAULT_TIME.getDuration().asHours();
        if (diff >= -DEFAULT_TIME.getMorningDuration().asHours()) {
            this.withDefaultTimes()
                ._times[3] = new Time(date.set(
                {'hour': DEFAULT_TIME.getDatetime(3).hour(), 'minute': DEFAULT_TIME.getDatetime(3).minute()})
                .add(diff, 'hours')
                .format(ISO_DATE_TIME))
        } else {
            diff = duration.asHours() - DEFAULT_TIME.getMorningDuration().asHours();
            this._times = [
                new Time(date.set({'hour': DEFAULT_TIME.getDatetime(0).hour(), 'minute': DEFAULT_TIME.getDatetime(0).minute()})
                    .format(ISO_DATE_TIME)),
                new Time(date.set({'hour': DEFAULT_TIME.getDatetime(1).hour(), 'minute': DEFAULT_TIME.getDatetime(1).minute()})
                    .add(diff, 'hours')
                    .format(ISO_DATE_TIME))
            ];
        }
    }

    public isWeekend(): boolean {
        return [6, 0].indexOf(this.date.day()) > -1;
    }

    public isSameDate(date: string): boolean {
        return this.date.format(ISO_DATE) === date;
    }

    public getMorningDuration(): Duration {
        let duration = moment.duration();
        this._times
            .map(timestamp => timestamp.getMoment())
            .filter(timestamp => timestamp.hour() < 13)
            .reduce((result, value, index, array) => {
                if (index % 2 === 0)
                    result.push(array.slice(index, index + 2));
                return result;
            }, [])
            .filter(pair => pair.length == 2)
            .forEach(pair => {
                duration.add(pair[1].diff(pair[0]))
            })
        ;
        return duration;
    }

    public isEmpty(): boolean {
        return !this._times || this._times.length == 0
    }

    static from(times: Time[]) {
        if (times && times.length > 0) {
            const date = moment(times[0].time);
            return new WorkingDateReporting(date, times);
        }
        return null;
    }
}

export function CalculateDuration(timbrages: Time[]): Duration {

    if (!timbrages || timbrages.length < 2) {
        // no _times
        return null;
    }

    let duration = moment.duration();
    // calculate duration by pairs of Timbrage
    splitPairs(timbrages).forEach(pair => {
        duration = duration.add(diff(pair[1], pair[0]));
    });

    return duration;
}

function diff(t1: Time, t0: Time): Duration {
    let diff = moment(t1.time).diff(moment(t0.time));

    return moment.duration(diff);
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

export const DEFAULT_TIME = new WorkingDateReporting(moment(),
    [time('08:00'), time('11:30'), time('12:30'), time('17:00')]);

function time(value: string): Time {
    return new Time(moment(value, ISO_TIME).format(ISO_DATE_TIME));
}
