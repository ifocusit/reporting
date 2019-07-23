import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/service/profile.service';
import { User } from 'src/app/model/user.model';
import { Observable, of } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { tap, mergeMap } from 'rxjs/operators';
import { SettingsState, SaveSettings } from 'src/app/store/settings.store';
import { Select, Store } from '@ngxs/store';
import { SettingsService } from 'src/app/service/settings.service';
import { Settings, DEFAULT_SETTINGS } from 'src/app/model/settings.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public user$: Observable<User>;

  @Select(SettingsState.project)
  public project$: Observable<string>;

  public settings$: Observable<Settings>;

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private settingsService: SettingsService,
    private store: Store
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      projectName: ['', Validators.required],
      timbrage: this.fb.group({
        dailyReport: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
      }),
      bill: this.fb.group({
        currency: ['', Validators.required],
        hourlyRate: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
        tvaRate: ['', [Validators.required, Validators.pattern(/^\d+\.\d{2}$/)]]
      })
    });

    this.user$ = this.profileService.user$.pipe(tap(user => this.form.patchValue(user)));

    this.settings$ = this.project$.pipe(
      mergeMap(projectName => this.settingsService.read(projectName)),
      mergeMap(settings => (settings ? of(settings) : this.settingsService.save(DEFAULT_SETTINGS))),
      tap(settings => this.form.patchValue(settings))
    );
  }

  public save() {
    this.store.dispatch(new SaveSettings({ ...this.form.value }));
  }
}
