import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ExportService } from '../../services/export.service';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { TimesState, SelectDate } from 'src/app/store/time.store';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  navLinks = [{ path: '/timbrage', label: 'Timbrage' }, { path: '/calendar', label: 'Calendar' }];

  @ViewChild('export', { static: true }) private exportLink: ElementRef;

  constructor(private exportService: ExportService, private store: Store, private authService: AuthService) {}

  ngOnInit() {}

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
