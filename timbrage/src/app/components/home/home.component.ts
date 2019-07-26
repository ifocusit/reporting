import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { of, from } from 'rxjs';
import { mergeMap, tap, catchError, take } from 'rxjs/operators';
import { ExportService } from '../../services/export.service';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { TimesState, SelectDate, AddTimes } from 'src/app/store/time.store';
import { StorageMap } from '@ngx-pwa/local-storage';
import { TimeAdapter, DATE_ISO_FORMAT, Time, TimeModel } from 'src/app/models/time.model';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  navLinks = [{ path: '/timbrage', label: 'Timbrage' }, { path: '/calendar', label: 'Calendar' }];

  @ViewChild('export', { static: true }) private exportLink: ElementRef;

  constructor(
    private exportService: ExportService,
    private store: Store,
    private storage: StorageMap,
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    setTimeout(() => this.migrateStorage(), 1000);
  }

  private migrateStorage() {
    this.storage
      .keys()
      .pipe(
        mergeMap(key => this.storage.get<Time[]>(key)),
        tap((times: Time[]) => this.store.dispatch(new AddTimes(times))),
        mergeMap(times => this.storage.delete(new TimeAdapter(times[0]).format(DATE_ISO_FORMAT))),
        catchError(() => of(true))
      )
      .subscribe();
    this.authService.user$
      .pipe(
        mergeMap(user =>
          this.firestore
            .collection<TimeModel>(`users/${user.uid}/times`)
            .valueChanges()
            .pipe(
              take(1),
              mergeMap(times => from(times)),
              tap(time => console.log(time)),
              mergeMap(time => this.firestore.collection<TimeModel>(`users/${user.uid}/projects/Default/times`).add(time)),
              mergeMap(data =>
                this.firestore
                  .collection<TimeModel>(`users/${user.uid}/times`)
                  .doc(data.id)
                  .delete()
              )
            )
        )
      )
      .subscribe();
  }

  public calendarPage() {
    return window.location.pathname.match('.*calendar.*');
  }

  public profilePage() {
    return window.location.pathname.match('.*profile.*');
  }

  public timbragePage() {
    return window.location.pathname.match('.*timbrage.*');
  }

  public exportMonth() {
    const date = this.store.selectSnapshot(TimesState.selectedDate);
    this.exportService.exportMonth(date, this.exportLink);
  }

  public goToday() {
    this.store.dispatch(new SelectDate(moment()));
  }

  signOut() {
    this.authService.signOutUser();
  }
}
