import {DATETIME_ISO_FORMAT} from "../models/time.model";
import {Action, State, StateContext} from "@ngxs/store";

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
            exportFormat: DATETIME_ISO_FORMAT
        }
    }
)
export class SettingsState {

    constructor() {
    }

    @Action(SetExportFormat)
    setExportFormat(ctx: StateContext<SettingsStateModel>, action: SetExportFormat) {
        ctx.setState({
            ...ctx.getState(),
            exportFormat: action.format
        });
    }
}
