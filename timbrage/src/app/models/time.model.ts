import * as moment from "moment";
import {Moment} from "moment";

export class Time {
    constructor(public time: string = moment().startOf('minute').format(), public _id: string = 'new') {
    }

    public toString(): string {
        return this.time;
    }

    public getDate(): Date {
        return new Date(this.time);
    }

    public getMoment(): Moment {
        return moment(this.time);
    }

    get hours(): number {
        return this.getMoment().hours();
    }

    set hours(hour: number) {
        this.time = this.getMoment().hours(hour).format();
    }

    get minutes(): number {
        return this.getMoment().minutes();
    }

    set minutes(minute: number) {
        this.time = this.getMoment().minutes(minute).format();
    }
}
