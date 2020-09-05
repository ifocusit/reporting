import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  AddTimes,
  AuthService,
  DATETIME_ISO_FORMAT,
  DeleteTimes,
  ExportService,
  SaveSettings,
  Settings,
  SettingsState,
  Time,
  TimeAdapter,
  TimeModel,
  TranslationService,
  User,
  UserService
} from '@ifocusit/commons';
import { Select, Store } from '@ngxs/store';
import * as set from 'lodash/set';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { filter, mergeMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'ifocusit-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public user$ = this.authService.user$;

  @Select(SettingsState.settings)
  public settings$: Observable<Settings>;

  @ViewChild('fileSelector', { static: true }) private fileSelector: ElementRef;
  public times: Time[];

  constructor(
    private authService: AuthService,
    private store: Store,
    private firestore: AngularFirestore,
    private exportService: ExportService,
    private userService: UserService,
    private translationService: TranslationService
  ) {}

  ngOnInit() {}

  public selectFile() {
    this.fileSelector.nativeElement.click();
  }

  public fileSelected(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.times = [];
      (reader.result as string).split('\r\n').forEach(line => {
        this.times.push(TimeAdapter.createTime(line));
      });
      this.times = this.times.filter(time => !!time);
      this.store.dispatch(new AddTimes(this.times)).subscribe(() => (this.times = undefined));
    };
    reader.readAsText(file);
  }

  public cancelImport() {
    if (this.times) {
      this.store.dispatch(new DeleteTimes(this.times)).subscribe(() => (this.times = null));
    }
  }

  signOut() {
    this.authService.signOutUser();
  }

  public exportAll() {
    this.user$
      .pipe(
        take(1),
        mergeMap(user =>
          this.store.selectOnce(SettingsState.project).pipe(
            mergeMap(project =>
              this.firestore
                .collection<TimeModel>(`users/${user.uid}/projects/${project}/times`, ref => ref.orderBy('timestamp'))
                .valueChanges()
                .pipe(
                  take(1),
                  filter(data => data && data.length > 0),
                  mergeMap(data => {
                    const fileName = `export_${user.displayName || user.uid}_all_times_${moment().format()}`;
                    const lines = data
                      .filter(time => time && time.timestamp)
                      .map(time => moment(time.timestamp).format(DATETIME_ISO_FORMAT));

                    return this.exportService.exportCsv(fileName, lines);
                  })
                )
            )
          )
        )
      )
      .subscribe();
  }

  public openAdmin() {
    window.open('https://reporting.ifocusit.ch', '_blank');
  }

  public setLang(lang: string) {
    this.userService
      .updateUser({ lang } as User)
      .pipe(tap(() => this.translationService.loadLang(lang)))
      .subscribe();
  }

  public updateSettings(settings: Settings, field: string, value: string) {
    let newSettings = { project: { name: settings.project.name } };
    newSettings = set(newSettings, field, value);
    this.store.dispatch(new SaveSettings(newSettings as Settings)).subscribe();
  }
}
