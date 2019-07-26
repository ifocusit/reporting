import { State, Action, StateContext, Selector } from '@ngxs/store';
import { mergeMap, map, tap } from 'rxjs/operators';
import { Settings, DEFAULT_SETTINGS } from '../model/settings.model';
import { ProjectService } from '../service/project.service';

export interface ProjectStateModel {
  name: string;
}

export class SelectProject {
  static readonly type = '[Project] SelectProject]';
  constructor(public readonly projectName: string) {}
}

export class DeleteProject {
  static readonly type = '[Project] DeleteProject]';
  constructor(public readonly projectName: string) {}
}

export class SaveProject {
  static readonly type = '[Project] SaveProject]';
  constructor(public readonly settings: Settings) {}
}

export class ReadSettings {
  static readonly type = '[Project] ReadSettings]';
  constructor(public readonly projectName: string) {}
}

export class SaveSettings {
  static readonly type = '[Project] SaveSettings]';
  constructor(public readonly settings: Settings) {}
}

@State<ProjectStateModel>({
  name: 'settings',
  defaults: {
    name: 'Default'
  }
})
export class ProjectState {
  constructor(private settingsService: ProjectService) {}

  @Selector()
  public static project(state: ProjectStateModel): string {
    return state.name;
  }

  @Action(SelectProject)
  select(ctx: StateContext<ProjectStateModel>, { projectName }: SelectProject) {
    ctx.patchState({ name: projectName });
  }

  @Action(DeleteProject)
  delete(ctx: StateContext<ProjectStateModel>, action: DeleteProject) {
    return this.settingsService.delete(action.projectName);
  }

  @Action(SaveProject)
  create(ctx: StateContext<ProjectStateModel>, action: SaveProject) {
    return this.settingsService
      .saveSettings(action.settings)
      .pipe(mergeMap(settings => ctx.dispatch(new SelectProject(settings.projectName))));
  }

  @Action(ReadSettings)
  readSettings(ctx: StateContext<ProjectStateModel>, action: ReadSettings) {
    return this.settingsService.readSettings(action.projectName).pipe(map(settings => ({ ...DEFAULT_SETTINGS, ...settings })));
  }

  @Action(SaveSettings)
  save(ctx: StateContext<ProjectStateModel>, action: SaveSettings) {
    return this.settingsService.saveSettings(action.settings);
  }
}
