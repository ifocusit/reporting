import * as moment from "moment";
import {Moment} from "moment";

export const DATETIME_ISO_FORMAT = "YYYY-MM-DDTHH:mm";
export const DATE_ISO_FORMAT = "YYYY-MM-DD";
export const MONTH_ISO_FORMAT = "YYYY-MM";

export interface Time {
    time: string;
    id?: string
}

export class TimeAdapter {

    constructor(private _time: Time) {
    }

    public static createTime(time: string | Moment = moment(), id?: string): Time | null {
        if (typeof time === "string") {
            time = moment(time);
        }
        if (!time.isValid()) {
            return null;
        }
        return {
            id: id,
            time: time.format(DATETIME_ISO_FORMAT)
        };
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
        return this.format(MONTH_ISO_FORMAT);
    }

    public getDay(): string {
        return this.format(DATE_ISO_FORMAT);
    }

    public format(format = DATETIME_ISO_FORMAT) {
        return this.getMoment().format(format);
    }

    public copyTimeWithCurrentTime(): Time {
        const time = this.getMoment();
        const now = moment();
        time.hours(now.hours());
        time.minutes(now.minutes());
        return {time: time.format(DATETIME_ISO_FORMAT)};
    }
}
