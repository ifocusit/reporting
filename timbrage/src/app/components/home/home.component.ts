import {Component, ElementRef, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {TimesState} from "../../store/time.store";
import {ExportService} from "../../services/export.service";
import {Store} from "@ngxs/store";
import {SelectDate} from "../../store/calendar.store";
import * as moment from "moment";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    navLinks = [
        {path: 'timbrage', label: 'Timbrage'},
        {path: 'calendar', label: 'Calendar'}
    ];

    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches)
        );

    @ViewChild('export') private exportLink: ElementRef;

    constructor(private breakpointObserver: BreakpointObserver, private exportService: ExportService, private store: Store) {
    }

    public calendarPage() {
        return window.location.pathname.match('.*calendar.*');
    }

    public exportMonth() {
        const date = this.store.selectSnapshot(TimesState.date);
        this.exportService.exportMonth(date, this.exportLink);
    }

    public goToday() {
        this.store.dispatch(new SelectDate(moment()));
    }
}
