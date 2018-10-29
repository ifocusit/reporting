import * as moment from "moment";
import {Moment} from "moment";

export const DATETIME_ISO_FORMAT = "YYYY-MM-DDTHH:mm";
export const DATE_ISO_FORMAT = "YYYY-MM-DD";
export const MONTH_ISO_FORMAT = "YYYY-MM";
const DATETIME_FORMAT = "YYYY-MM-DD HH:mm";

export class Time {

    public constructor(public time: string = moment().format(DATETIME_ISO_FORMAT), public id?: string) {
    }
}

export class TimeAdapter {

    constructor(private _time: Time) {
    }

    get time() {
        return this._time;
    }

    public getDate(): Date {
        return new Date(this._time.time);
    }

    public getMoment(): Moment {
        return moment(this._time.time);
    }

    get hours(): number {
        return this.getMoment().hours();
    }

    set hours(hour: number) {
        this._time.time = this.getMoment().hours(hour).format(DATETIME_ISO_FORMAT);
    }

    get minutes(): number {
        return this.getMoment().minutes();
    }

    set minutes(minute: number) {
        this._time.time = this.getMoment().minutes(minute).format(DATETIME_ISO_FORMAT);
    }

    public getMonth(): string {
        return this.getMoment().format(MONTH_ISO_FORMAT);
    }

    public getDay(): string {
        return this.getMoment().format(DATE_ISO_FORMAT);
    }

    public toString(): string {
        return this.getMoment().format(DATETIME_FORMAT);
    }

    public copyTimeWithCurrentTime(): Time {
        const time = this.getMoment();
        const now = moment();
        time.hours(now.hours());
        time.minutes(now.minutes());
        return new Time(time.format(DATETIME_ISO_FORMAT));
    }
}
