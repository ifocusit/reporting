import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { mergeMap, tap } from 'rxjs/operators';
import { ProjectService } from './project.service';
import { DEFAULT_SETTINGS, Settings } from './settings.model';

export interface SettingsStateModel {
  settings: Settings;
}

export class ReadSettings {
  static readonly type = '[Settings] ReadSettings]';
  constructor(public readonly projectName: string) {}
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
@Injectable()
export class SettingsState {
  constructor(private store: Store, private settingsService: ProjectService) {}

  @Selector()
  public static settings(state: SettingsStateModel): Settings {
    return state.settings;
  }

  @Selector()
  public static theme(state: SettingsStateModel): string {
    return state.settings.project.theme;
  }

  @Selector()
  public static project(state: SettingsStateModel): string {
    return state.settings.project.name;
  }

  @Action(ReadSettings)
  read(ctx: StateContext<SettingsStateModel>, { projectName }: ReadSettings) {
    return this.settingsService.getSettings(projectName).pipe(tap(settings => ctx.patchState({ settings })));
  }

  @Action(SaveSettings)
  save(ctx: StateContext<SettingsStateModel>, action: SaveSettings) {
    return this.settingsService
      .saveSettings(action.settings)
      .pipe(mergeMap(() => this.store.dispatch(new ReadSettings(action.settings.project.name))));
  }
}
