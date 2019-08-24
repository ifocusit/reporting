import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'projects/commons/src/lib/auth/auth.service';
import { Store } from '@ngxs/store';
import { ExportService } from 'projects/commons/src/lib/times/export.service';
import { TimesState, SelectDate } from 'projects/commons/src/lib/times/time.store';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  navLinks = [{ path: '/timbrage', label: 'Timbrage' }, { path: '/calendar', label: 'Calendar' }];

  @ViewChild('export', { static: true }) private exportLink: ElementRef;

  constructor(private exportService: ExportService, private store: Store, private authService: AuthService) {}

  ngOnInit() {}

  public calendarPage() {
    return this.isPage('calendar');
  }

  public profilePage() {
    return this.isPage('profile');
  }

  public timbragePage() {
    return this.isPage('timbrage');
  }

  public loginPage() {
    return this.isPage('login');
  }

  private isPage(pageName: string) {
    return window.location.pathname.match(`/${pageName}`);
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
