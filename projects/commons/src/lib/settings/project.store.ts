import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { mergeMap } from 'rxjs/operators';
import { Settings } from './settings.model';
import { ProjectService } from './project.service';
import { AuthService } from '../auth/auth.service';

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

export class SaveSettings {
  static readonly type = '[Project] SaveSettings]';
  constructor(public readonly settings: Settings) {}
}

@State<ProjectStateModel>({
  name: 'project',
  defaults: {
    name: 'Default'
  }
})
export class ProjectState {
  constructor(private settingsService: ProjectService, private store: Store, private authService: AuthService) {
    this.authService.user$.subscribe(user => this.store.dispatch(new SelectProject(user.lastProject)));
  }

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

  @Action(SaveSettings)
  save(ctx: StateContext<ProjectStateModel>, action: SaveSettings) {
    return this.settingsService.saveSettings(action.settings);
  }
}
