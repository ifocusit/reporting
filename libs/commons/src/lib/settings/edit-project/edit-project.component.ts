import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { mergeMap } from 'rxjs/operators';
import { ProjectService } from '../project.service';
import { DEFAULT_SETTINGS, Settings } from '../settings.model';
import { ReadSettings, SaveSettings } from '../settings.store';

@Component({
  selector: 'lib-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {
  public themes = [
    { code: 'default-theme', primary: '#3f51b5', accent: '#ff4081', warn: '#f44336' },
    { code: 'mobi-theme', primary: '#d50000', accent: '#3f51b5', warn: '#f44336' },
    { code: 'deeppurple-amber-theme', primary: '#673ab7', accent: '#ffd740', warn: '#f44336' },
    { code: 'pink-bluegrey-theme', primary: '#c2185b', accent: '#b0bec5', warn: '#f44336' },
    { code: 'purple-green-theme', primary: '#7b1fa2', accent: '#69f0ae', warn: '#f44336' }
  ];

  @Input() projectName: string = DEFAULT_SETTINGS.project.name;
  @Input() selectedTheme = DEFAULT_SETTINGS.project.theme;

  constructor(private store: Store, private projectService: ProjectService) {}

  ngOnInit() {}

  get name() {
    return this.name;
  }

  set name(name: string) {
    this.projectName = name;
    this.store.dispatch(new SaveSettings({ project: { name } } as Settings)).subscribe();
  }

  public selectTheme(code: string) {
    this.selectedTheme = code;
    this.store.dispatch(new SaveSettings({ project: { name: this.projectName, theme: code } } as Settings)).subscribe();
  }

  public addProject(projectName: string) {
    this.store.dispatch(new SaveSettings({ project: { name: projectName } } as Settings)).subscribe();
  }

  public removeProject(projectName: string) {
    this.projectService
      .delete(projectName)
      .pipe(mergeMap(() => this.store.dispatch(new ReadSettings(DEFAULT_SETTINGS.project.name))))
      .subscribe();
  }
}
