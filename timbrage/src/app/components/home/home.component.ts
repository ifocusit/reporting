import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, from, of } from 'rxjs';
import { map, mergeMap, tap, catchError, pairwise } from 'rxjs/operators';
import { ExportService } from '../../services/export.service';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { TimesState, SelectDate, AddTimes } from 'src/app/store/time.store';
import { StorageMap } from '@ngx-pwa/local-storage';
import { filter } from 'minimatch';
import { TimeAdapter, DATE_ISO_FORMAT, Time } from 'src/app/models/time.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  navLinks = [{ path: '/timbrage', label: 'Timbrage' }, { path: '/calendar', label: 'Calendar' }];

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result: { matches: boolean }) => result.matches));

  @ViewChild('export', { static: true }) private exportLink: ElementRef;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private exportService: ExportService,
    private store: Store,
    private authService: AuthService,
    private storage: StorageMap
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
  }

  public calendarPage() {
    return window.location.pathname.match('.*calendar.*');
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
