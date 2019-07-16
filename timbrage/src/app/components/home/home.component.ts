import { Component, ElementRef, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExportService } from '../../services/export.service';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { TimesState, SelectDate } from 'src/app/store/time.store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  navLinks = [{ path: '/timbrage', label: 'Timbrage' }, { path: '/calendar', label: 'Calendar' }];

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result: { matches: boolean }) => result.matches));

  @ViewChild('export', { static: true }) private exportLink: ElementRef;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private exportService: ExportService,
    private store: Store,
    private authService: AuthService
  ) {}

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
