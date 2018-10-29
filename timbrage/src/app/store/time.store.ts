import {Time} from "../models/time.model";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {TimesClientService} from "../services/times-client.service";
import {map, tap} from "rxjs/operators";
import * as _ from 'lodash';
import * as moment from "moment";
import {Moment} from "moment";

//**************************************************************************************/
// STATE
//**************************************************************************************/

// description de l'état
export interface TimesStateModel {
    loading: boolean;
    date: string;
    times: Time[];
}

//**************************************************************************************/
// ACTIONS
//**************************************************************************************/

// définition des actions possibles sur l'état
export class AddTime {
    static readonly type = '[Time] Add Time';

    constructor(public time: Time) {
    }
}

export class UpdateTime {
    static readonly type = '[Time] Update Time';

    constructor(public time: Time) {
    }
}

export class DeleteTime {
    static readonly type = '[Time] Delete Time';

    constructor(public time: Time) {
    }
}

export class ReadTimes {
    static readonly type = '[Time] Read Times';

    constructor(public date: string) {
    }
}

export class ReadedTimes {
    static readonly type = '[Time] Readed Times';

    constructor(public times: Time[]) {
    }
}

//**************************************************************************************/
// MUTATIONS SUR L'ETAT
//**************************************************************************************/

// initialisation de l'état
@State<TimesStateModel>({
    name: 'times',
    defaults: {
        date: moment().format("YYYY-MM-DD"),
        loading: false,
        times: []
    }
})
export class TimesState {

    constructor(private timeClient: TimesClientService) {
    }

    // SELECTORS

    @Selector()
    public static loading(state: TimesStateModel) {
        return state.loading;
    }

    @Selector()
    public static times(state: TimesStateModel) {
        return _.orderBy(state.times, ['time'], ['asc']);
    }

    @Selector()
    public static date(state: TimesStateModel): Moment {
        return moment(state.date);
    }

    // ACTIONS

    @Action(ReadTimes)
    readTimes(ctx: StateContext<TimesStateModel>, action: ReadTimes) {
        ctx.setState({
            ...ctx.getState(),
            loading: true,
            date: action.date,
            times: []
        });

        return this.timeClient.read(action.date).pipe(
            map((times: Time[]) => ctx.dispatch(new ReadedTimes(times)))
        );
    }

    @Action(ReadedTimes)
    readedTimes(ctx: StateContext<TimesStateModel>, action: ReadedTimes) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            loading: false,
            times: action.times
        });
    }

    @Action(AddTime)
    addTime(ctx: StateContext<TimesStateModel>, action: AddTime) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            loading: true
        });
        return this.timeClient.create(action.time).pipe(
            map((time: Time) => {
                ctx.setState({
                    ...state,
                    loading: false,
                    times: [
                        ...state.times,
                        time
                    ]
                });
            })
        );
    }

    @Action(UpdateTime)
    updateTime(ctx: StateContext<TimesStateModel>, action: UpdateTime) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            loading: true
        });
        return this.timeClient.update(action.time).pipe(
            tap((time: Time) => {
                state.times.filter(value => value.id === time.id).forEach(value => value.time = time.time);
                ctx.setState({
                    ...state,
                    loading: false
                });
            })
        );
    }

    @Action(DeleteTime)
    deleteTime(ctx: StateContext<TimesStateModel>, action: DeleteTime) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            loading: true
        });
        return this.timeClient.delete(action.time).pipe(
            tap(() => {
                ctx.setState({
                    ...state,
                    loading: false,
                    times: state.times.filter(time => time.id !== action.time.id)
                });
            })
        );
    }
}
