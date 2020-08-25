import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  AuthService,
  BillService,
  ExportService,
  InitializationService,
  LOCATION_TOKEN,
  MonthGraphDialogComponent,
  SelectDate,
  TimesState
} from '@ifocusit/commons';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'ifocusit-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  navLinks = [
    { path: '/timbrage', label: 'timbrage.title' },
    { path: '/calendar', label: 'calendar.title' }
  ];

  bill$ = this.billService.bill$;

  constructor(
    private initializationService: InitializationService,
    private store: Store,
    private authService: AuthService,
    private exportService: ExportService,
    public dialog: MatDialog,
    private billService: BillService,
    @Inject(LOCATION_TOKEN) private location: Location
  ) {}

  ngOnInit() {
    this.initializationService.initialize();
  }

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
    return this.location.pathname.match(`/${pageName}`);
  }

  public exportMonth() {
    this.store.selectOnce(TimesState.selectedDate).subscribe(date => this.exportService.exportMonth(date));
  }

  public goToday() {
    this.store.dispatch(new SelectDate(moment()));
  }

  signOut() {
    this.authService.signOutUser();
  }

  public showGraph() {
    this.store
      .selectOnce(TimesState.selectedMonth)
      .pipe(
        tap(month =>
          this.dialog.open(MonthGraphDialogComponent, {
            width: '280px',
            height: '220px',
            data: month
          })
        )
      )
      .subscribe();
  }
}
