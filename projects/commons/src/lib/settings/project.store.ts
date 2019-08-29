import { State, Action, StateContext, Selector } from '@ngxs/store';
import { mergeMap } from 'rxjs/operators';
import { Settings } from './settings.model';
import { ProjectService } from './project.service';

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

@State<ProjectStateModel>({
  name: 'project',
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
      .pipe(mergeMap(settings => ctx.dispatch(new SelectProject(settings.project.name))));
  }
}
