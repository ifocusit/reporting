//**************************************************************************************/
// STATE
//**************************************************************************************/

// description de l'état
import * as moment from "moment";
import {Moment} from "moment";
import {TimesClientService} from "../services/times-client.service";
import {Action, Selector, State, StateContext, Store} from "@ngxs/store";
import {DATE_ISO_FORMAT, MONTH_ISO_FORMAT, Time, TimeAdapter} from "../models/time.model";
import {map, toArray} from "rxjs/operators";
import {ReadTimes, TimesState} from "./time.store";

export interface CalendarDayModel {
    date: Moment;
    hasTimes: boolean;
}

export interface CalendarStateModel {
    loading: boolean;
    days: CalendarDayModel[];
}

//**************************************************************************************/
// ACTIONS
//**************************************************************************************/

export class SelectDate {
    static readonly type = '[Calendar] Set Date';

    constructor(public date: Moment) {
    }
}

export class MoveMonth {
    static readonly type = '[Calendar] Move Month';

    constructor(public change: number) {
    }
}

export class MonthTimesReaded {
    static readonly type = '[Calendar] Month Times Readed';

    constructor(public date: string, public times: Time[][]) {
    }
}

//**************************************************************************************/
// MUTATIONS SUR L'ETAT
//**************************************************************************************/
@State<CalendarStateModel>({
    name: 'calendar',
    defaults: {
        loading: false,
        days: []
    },
    children: [TimesState]
})
export class CalendarState {

    constructor(private timeClient: TimesClientService, private store: Store) {
    }

    // SELECTORS

    @Selector()
    public static days(state: CalendarStateModel) {
        return state.days;
    }

    // ACTIONS

    @Action(SelectDate)
    selectDate(ctx: StateContext<CalendarStateModel>, action: SelectDate) {
        if (ctx.getState().days.length > 0) {
            const selected = this.store.selectSnapshot(TimesState.date);

            if (selected.format(MONTH_ISO_FORMAT) === action.date.format(MONTH_ISO_FORMAT)) {
                // month don't change => only reload day times
                return ctx.dispatch(new ReadTimes(action.date.format(DATE_ISO_FORMAT)));
            }
        }

        ctx.setState({
            ...ctx.getState(),
            loading: true,
            days: []
        });

        // load month
        return this.timeClient.read(action.date.format(MONTH_ISO_FORMAT)).pipe(
            toArray(),
            map(times => ctx.dispatch(new MonthTimesReaded(action.date.format(DATE_ISO_FORMAT), times)))
        );
    }

    @Action(MonthTimesReaded)
    monthTimesReaded(ctx: StateContext<CalendarStateModel>, action: MonthTimesReaded) {

        // list of days having times
        const daysWithTimes = [];
        action.times.filter(times => times.length > 0)
            .forEach(times => daysWithTimes.push(new TimeAdapter(times[0]).getDay()));

        const state = ctx.getState();
        const days = CalendarState.getDaysInMonth(action.date);
        ctx.setState({
            ...state,
            loading: false,
            days: days.map(date => ({
                date: date,
                hasTimes: !!daysWithTimes.find(dateWithTimes => dateWithTimes === date.format(DATE_ISO_FORMAT))
            }))
        });

        return ctx.dispatch(new ReadTimes(action.date));
    }

    @Action(MoveMonth)
    moveMonth(ctx: StateContext<CalendarStateModel>, action: MoveMonth) {
        const selected = this.store.selectSnapshot(TimesState.date);
        const date = moment(selected);
        return ctx.dispatch(new SelectDate(date.add(action.change, 'months')));
    }

    private static getDaysInMonth(selectedDate: string): Moment[] {
        const days = [];
        let date = moment(selectedDate).date(1);
        while (date.days() !== 1) {
            date.add(-1, 'days');
            days.unshift(moment(date));
        }
        date = moment(selectedDate).date(1);
        const daysInMonth = date.daysInMonth();
        for (let i = 0; i < daysInMonth; i++) {
            days.push(moment(date));
            date.add(1, 'days');
        }
        while (days.length < 35) {
            days.push(moment(date));
            date.add(1, 'days');
        }
        return days;
    }
}