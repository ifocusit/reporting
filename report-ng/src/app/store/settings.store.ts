import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { mergeMap, tap } from 'rxjs/operators';
import { ProfileService } from '../service/profile.service';
import { Settings } from '../model/settings.model';
import { SettingsService } from '../service/settings.service';

export interface SettingsStateModel {
  projectName: string;
}

export class SelectProject {
  static readonly type = '[Settings] SelectProject]';
  constructor(public readonly projectName: string) {}
}

export class CreateProject {
  static readonly type = '[Settings] CreateProject]';
  constructor(public readonly settings: Settings) {}
}

export class SaveSettings {
  static readonly type = '[Settings] SaveSettings]';
  constructor(public readonly settings: Settings) {}
}

@State<SettingsStateModel>({
  name: 'settings',
  defaults: {
    projectName: 'Default'
  }
})
export class SettingsState {
  constructor(private settingsService: SettingsService) {}

  @Selector()
  public static project(state: SettingsStateModel) {
    return state.projectName;
  }

  @Action(SelectProject)
  select(ctx: StateContext<SettingsStateModel>, { projectName }: SelectProject) {
    ctx.patchState({ projectName });
  }

  @Action(CreateProject)
  create(ctx: StateContext<SettingsStateModel>, action: CreateProject) {
    return this.settingsService.save(action.settings).pipe(mergeMap(settings => ctx.dispatch(new SelectProject(settings.projectName))));
  }

  @Action(SaveSettings)
  save(ctx: StateContext<SettingsStateModel>, action: CreateProject) {
    return this.settingsService.save(action.settings);
  }
}
