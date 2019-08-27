import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';
import { ProjectState, SelectProject } from 'projects/commons/src/lib/settings/project.store';
import { ProjectService } from 'projects/commons/src/lib/settings/project.service';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/user.model';
import { Settings } from '../settings.model';

@Component({
  selector: 'lib-select-project',
  templateUrl: './select-project.component.html',
  styleUrls: ['./select-project.component.scss']
})
export class SelectProjectComponent implements OnInit {
  @Input()
  public defaultName = 'Reporting';

  @Select(ProjectState.project)
  public project$: Observable<string>;

  public projects$: Observable<string[]>;
  public user$: Observable<User>;

  @Output()
  public valueChange = new EventEmitter<string>();

  constructor(private store: Store, private projectService: ProjectService, private authService: AuthService) {}

  ngOnInit() {
    this.user$ = this.authService.user$;
    this.projects$ = this.projectService.projects$;
  }

  public select(projectName) {
    return this.store
      .dispatch(new SelectProject(projectName))
      .pipe(
        tap(() => this.valueChange.emit(projectName)),
        mergeMap(() => this.authService.updateUser({ lastProject: projectName } as User))
      )
      .subscribe();
  }
}
