import {Moment} from "moment";


export class AddTime {
    static readonly type = '[Time] Add Time';

    constructor(public time: string | Moment | Date) {
    }
}