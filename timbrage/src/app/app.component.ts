import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MediaMatcher} from "@angular/cdk/layout";
import {registerLocaleData} from "@angular/common";
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';
import {ExportService} from "./services/export.service";
import {AddTimes, DeleteTimes, TimesState} from "./store/time.store";
import {Store} from "@ngxs/store";
import * as moment from "moment";
import {LoadSettings, SetExportFormat} from "./store/settings.store";
import {FormControl, Validators} from "@angular/forms";
import {Time, TimeAdapter} from "./models/time.model";

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
    @ViewChild('fileSelector') private fileSelector: ElementRef;

    public formatFormControl = new FormControl('', [Validators.required]);
    public times: Time[];

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

    public selectFile() {
        this.fileSelector.nativeElement.click();
    }

    public fileChanged(e) {
        const file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = () => {
            this.times = [];
            reader.result.split('\r\n').forEach(line => {
                this.times.push(TimeAdapter.createTime(line));
            });
            this.times = this.times.filter(time => !!time);
            this.store.dispatch(new AddTimes(this.times));
        };
        reader.readAsText(file);
    }

    public cancelImport() {
        if (this.times) {
            this.store.dispatch(new DeleteTimes(this.times)).subscribe(() => this.times = undefined);
        }
    }
}
