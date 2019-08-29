import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { mergeMap, tap, take } from 'rxjs/operators';
import { Settings, DEFAULT_SETTINGS } from './settings.model';
import { ProjectService } from './project.service';
import { ProjectState } from './project.store';

export interface SettingsStateModel {
  settings: Settings;
}

export class ReadSettings {
  static readonly type = '[Settings] ReadSettings]';
  constructor() {}
}

export class SaveSettings {
  static readonly type = '[Settings] SaveSettings]';
  constructor(public readonly settings: Settings) {}
}

@State<SettingsStateModel>({
  name: 'settings',
  defaults: {
    settings: DEFAULT_SETTINGS
  }
})
export class SettingsState {
  constructor(private store: Store, private settingsService: ProjectService) {}

  @Selector()
  public static settings(state: SettingsStateModel) {
    return state.settings;
  }

  @Selector()
  public static theme(state: SettingsStateModel) {
    return state.settings.project.theme;
  }

  @Action(ReadSettings)
  read(ctx: StateContext<SettingsStateModel>) {
    return this.store.selectOnce(ProjectState.project).pipe(
      mergeMap(projectName => this.settingsService.getSettings(projectName)),
      tap(settings => ctx.patchState({ settings }))
    );
  }

  @Action(SaveSettings)
  save(ctx: StateContext<SettingsStateModel>, action: SaveSettings) {
    return this.settingsService.saveSettings(action.settings).pipe(mergeMap(() => this.store.dispatch(new ReadSettings())));
  }
}
