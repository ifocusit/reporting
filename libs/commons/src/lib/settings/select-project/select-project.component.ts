import { Component, Input, OnInit, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { User } from '../../auth/user/user.model';
import { UserService } from '../../auth/user/user.service';
import { ProjectService } from '../project.service';
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

  public project$ = inject(Store).select(SettingsState.project);

  public projects$: Observable<string[]>;
  public user$: Observable<User>;

  constructor(private store: Store, private projectService: ProjectService, private userService: UserService) {
    this.user$ = this.userService.user$;
    this.projects$ = this.projectService.projects$;
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  public select(projectName: string) {
    return this.store
      .dispatch(new ReadSettings(projectName))
      .pipe(mergeMap(() => this.userService.updateUser({ lastProject: projectName } as User)))
      .subscribe();
  }
}
