import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ProjectState, SelectProject } from 'src/app/store/project.store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'select-project',
  templateUrl: './select-project.component.html',
  styleUrls: ['./select-project.component.scss']
})
export class SelectProjectComponent implements OnInit {
  @Select(ProjectState.project)
  public project$: Observable<string>;
  public projects$ = this.projectService.projects$;

  @Output()
  public valueChange = new EventEmitter<string>();

  constructor(private store: Store, private projectService: ProjectService) {}

  ngOnInit() {}

  public select(projectName) {
    return this.store
      .dispatch(new SelectProject(projectName))
      .pipe(tap(() => this.valueChange.emit(projectName)))
      .subscribe();
  }
}
