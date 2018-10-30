import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MediaMatcher} from "@angular/cdk/layout";
import {registerLocaleData} from "@angular/common";
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';
import {ExportService} from "./services/export.service";
import {TimesState} from "./store/time.store";
import {Store} from "@ngxs/store";
import * as moment from "moment";
import {LoadSettings, SetExportFormat} from "./store/settings.store";
import {FormControl, Validators} from "@angular/forms";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    mobileQuery: MediaQueryList;

    navLinks = [
        {path: 'timbrage', label: 'Timbrage'},
        {path: 'calendar', label: 'Calendar'}
    ];
    private _mobileQueryListener: () => void;

    @ViewChild('export') private exportLink: ElementRef;

    public formatFormControl = new FormControl('', [Validators.required]);

    constructor(private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher,
                private store: Store, private exportService: ExportService) {

        registerLocaleData(localeFr, 'fr', localeFrExtra);
        moment.locale('fr');

        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit(): void {
        this.store.dispatch(new LoadSettings()).subscribe(state => this.formatFormControl.setValue(state.settings.exportFormat));
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    public exportMonth() {
        const date = this.store.selectSnapshot(TimesState.date);
        this.exportService.exportMonth(date, this.exportLink);
    }

    public calendarPage() {
        return window.location.pathname.match('.*calendar.*');
    }

    public setExportFormat() {
        this.store.dispatch(new SetExportFormat(this.formatFormControl.value));
    }
}
