import { Component, OnInit } from '@angular/core';
import { Observable, range } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { tap, mergeMap, map, toArray } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import * as moment from 'moment';
import { AuthService } from 'projects/commons/src/lib/auth/auth.service';
import { User } from 'projects/commons/src/lib/auth/user.model';
import { DEFAULT_SETTINGS, Settings } from 'projects/commons/src/lib/settings/settings.model';
import { ProjectService } from 'projects/commons/src/lib/settings/project.service';
import { SaveProject, SelectProject, SaveSettings, ProjectState } from 'projects/commons/src/lib/settings/project.store';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public themes = [
    { code: 'default-theme', primary: '#3f51b5', accent: '#ff4081', warn: '#f44336' },
    { code: 'mobi-theme', primary: '#d50000', accent: '#3f51b5', warn: '#f44336' },
    { code: 'deeppurple-amber-theme', primary: '#673ab7', accent: '#ffd740', warn: '#f44336' },
    { code: 'pink-bluegrey-theme', primary: '#c2185b', accent: '#b0bec5', warn: '#f44336' },
    { code: 'purple-green-theme', primary: '#7b1fa2', accent: '#69f0ae', warn: '#f44336' }
  ];

  public user$: Observable<User>;

  @Select(ProjectState.project)
  public project$: Observable<string>;

  public settings$: Observable<Settings>;
  public projects$: Observable<string[]>;

  public form: FormGroup;

  public logo$: Observable<string>;

  public months$: Observable<string[]>;
  public today = moment().format('YYYY-MM');

  public uploadLogo$ = (file: File) => this.project$.pipe(mergeMap(projectName => this.projectService.uploadLogo(file, projectName)));

  constructor(private fb: FormBuilder, private projectService: ProjectService, private store: Store, private authService: AuthService) {}

  signOut() {
    this.authService.signOutUser();
  }

  ngOnInit() {
    this.form = this.fb.group({
      project: this.fb.group({
        name: ['', Validators.required],
        theme: ''
      }),
      timbrage: this.fb.group({
        dailyReport: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
      }),
      bill: this.fb.group({
        currency: ['', Validators.required],
        tvaNumber: ['', Validators.required],
        correspondant: ['', Validators.required],
        society: ['', Validators.required],
        hourlyRate: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
        tvaRate: ['', [Validators.required, Validators.pattern(/^\d+\.\d{2}$/)]],
        account: this.fb.group({
          number: ['', Validators.required],
          iban: ['', Validators.required]
        })
      })
    });

    this.user$ = this.authService.user$.pipe(tap(user => this.form.patchValue(user)));

    this.settings$ = this.project$.pipe(
      tap(() => this.form.reset()),
      mergeMap(projectName => this.projectService.readSettings(projectName)),
      tap(settings => this.form.patchValue(settings))
    );

    this.projects$ = this.projectService.projects$;

    this.logo$ = this.project$.pipe(mergeMap(projectName => this.projectService.readLogo(projectName)));

    this.months$ = range(0, 12).pipe(
      map(index =>
        moment()
          .month(index)
          .format('YYYY-MM')
      ),
      toArray()
    );
  }

  public setTheme(code: string) {
    this.form.patchValue({ project: { theme: code } });
  }

  public addProject(projectName: string) {
    this.store.dispatch(new SaveProject({ ...DEFAULT_SETTINGS, project: { name: projectName } })).subscribe();
  }

  public removeProject(projectName: string) {
    this.projectService
      .delete(projectName)
      .pipe(mergeMap(() => this.store.dispatch(new SelectProject(DEFAULT_SETTINGS.project.name))))
      .subscribe();
  }

  public save() {
    this.store.dispatch(new SaveSettings({ ...this.form.value }));
  }
}
