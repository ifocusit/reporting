import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ProjectService } from 'projects/commons/src/lib/settings/project.service';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { User } from '../../auth/user/user.model';
import { UserService } from '../../auth/user/user.service';
import { ReadSettings, SettingsState } from '../settings.store';

@Component({
  selector: 'lib-select-project',
  templateUrl: './select-project.component.html',
  styleUrls: ['./select-project.component.scss']
})
export class SelectProjectComponent implements OnInit {
  @Input()
  public defaultName = 'Reporting';

  @Input()
  public readonly = false;

  @Select(SettingsState.project)
  public project$: Observable<string>;

  public projects$: Observable<string[]>;
  public user$: Observable<User>;

  constructor(private store: Store, private projectService: ProjectService, private userService: UserService) {}

  ngOnInit() {
    this.user$ = this.userService.user$;
    this.projects$ = this.projectService.projects$;
  }

  public select(projectName) {
    return this.store
      .dispatch(new ReadSettings(projectName))
      .pipe(mergeMap(() => this.userService.updateUser({ lastProject: projectName } as User)))
      .subscribe();
  }
}
