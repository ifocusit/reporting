import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import * as moment from 'moment';
import { AuthService } from 'projects/commons/src/lib/auth/auth.service';
import { ProjectService } from 'projects/commons/src/lib/settings/project.service';
import { Settings } from 'projects/commons/src/lib/settings/settings.model';
import { SaveSettings, SettingsState } from 'projects/commons/src/lib/settings/settings.store';
import { Observable, range } from 'rxjs';
import { map, mergeMap, tap, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public user$ = this.authService.user$;

  @Select(SettingsState.project)
  public project$: Observable<string>;

  public settings$: Observable<Settings>;
  public projects$: Observable<string[]>;

  public form: FormGroup;

  public logo$: Observable<string>;

  public months$: Observable<string[]>;
  public today = moment().format('YYYY-MM');

  public uploadLogo$ = (file: File) => this.project$.pipe(mergeMap(projectName => this.projectService.uploadLogo(file, projectName)));

  constructor(private fb: FormBuilder, private projectService: ProjectService, private store: Store, private authService: AuthService) {}

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

    this.settings$ = this.store.select(SettingsState.settings).pipe(tap(settings => this.form.patchValue(settings)));

    this.projects$ = this.projectService.projects$;

    this.logo$ = this.project$.pipe(mergeMap(projectName => this.projectService.readLogo(projectName)));

    this.months$ = range(0, 12).pipe(
      map(index => moment().month(index).format('YYYY-MM')),
      toArray()
    );
  }

  public save() {
    this.store.dispatch(new SaveSettings({ ...this.form.value }));
  }
}
