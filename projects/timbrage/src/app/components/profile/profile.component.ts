import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Time, TimeAdapter, TimeModel, DATETIME_ISO_FORMAT } from 'projects/commons/src/lib/times/time.model';
import { Store } from '@ngxs/store';
import { AddTimes, DeleteTimes } from 'projects/commons/src/lib/times/time.store';
import { mergeMap, take, tap, map, filter } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProjectState } from 'projects/commons/src/lib/settings/project.store';
import * as moment from 'moment';
import { ExportService } from 'projects/commons/src/lib/times/export.service';
import { User } from 'projects/commons/src/lib/auth/user.model';
import { AuthService } from 'projects/commons/src/lib/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private store: Store,
    private firestore: AngularFirestore,
    private exportService: ExportService
  ) {}
  public user$: Observable<User>;

  @ViewChild('export', { static: true }) private exportLink: ElementRef;

  @ViewChild('fileSelector', { static: true }) private fileSelector: ElementRef;
  public times: Time[];

  ngOnInit() {
    this.user$ = this.authService.user$;
  }

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
}
