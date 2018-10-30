import {Action, State, StateContext} from "@ngxs/store";
import {of} from "rxjs";
import {filter, map, tap} from "rxjs/operators";

export interface SettingsTimeStateModel {
    hour: number;
    minute: number;
}

export interface SettingsStateModel {
    endOfDay: SettingsTimeStateModel;
    startOfDay: SettingsTimeStateModel;
    saveMissings: boolean;
    exportFormat: string;
}

export class LoadSettings {
    static readonly type = '[Settings] Load';

    constructor() {
    }
}

export class SaveSettings {
    static readonly type = '[Settings] Save';

    constructor() {
    }
}

export class SetExportFormat {
    static readonly type = '[Settings] Set Export Format';

    constructor(public format: string) {
    }
}

@State<SettingsStateModel>({
        name: 'settings',
        defaults: {
            endOfDay: {
                hour: 18,
                minute: 0
            },
            startOfDay: {
                hour: 8,
                minute: 0
            },
            saveMissings: true,
            exportFormat: 'YYYY-MM-DD HH:mm'
        }
    }
)
export class SettingsState {
    private static SETTINGS_KEY = 'timbrage-settings';

    constructor() {
    }

    @Action(LoadSettings)
    loadSettings(ctx: StateContext<SettingsStateModel>) {
        return of(localStorage.getItem(SettingsState.SETTINGS_KEY))
            .pipe(
                tap(value => console.log("item=" + value)),
                filter(value => !!value),
                map(json => JSON.parse(json)),
                tap(settings => ctx.setState(settings))
            );
    }

    @Action(SaveSettings)
    saveSettings(ctx: StateContext<SettingsStateModel>) {
        localStorage.setItem(SettingsState.SETTINGS_KEY, JSON.stringify(ctx.getState()));
    }

    @Action(SetExportFormat)
    setExportFormat(ctx: StateContext<SettingsStateModel>, action: SetExportFormat) {
        ctx.setState({
            ...ctx.getState(),
            exportFormat: action.format
        });

        return ctx.dispatch(new SaveSettings());
    }
}
