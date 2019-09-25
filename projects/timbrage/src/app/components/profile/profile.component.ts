import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { AuthService } from 'projects/commons/src/lib/auth/auth.service';
import { User } from 'projects/commons/src/lib/auth/user/user.model';
import { UserService } from 'projects/commons/src/lib/auth/user/user.service';
import { ProjectState } from 'projects/commons/src/lib/settings/project.store';
import { ExportService } from 'projects/commons/src/lib/times/export.service';
import { DATETIME_ISO_FORMAT, Time, TimeAdapter, TimeModel } from 'projects/commons/src/lib/times/time.model';
import { AddTimes, DeleteTimes } from 'projects/commons/src/lib/times/time.store';
import { TranslationService } from 'projects/commons/src/lib/translation/translation.service';
import { filter, mergeMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public user$ = this.authService.user$;

  @ViewChild('export', { static: true }) private exportLink: ElementRef;

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
          this.store.select(ProjectState.project).pipe(
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

                    return this.exportService.export(fileName, lines, this.exportLink);
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
}
