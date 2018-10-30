import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatOptionModule,
    MatSelectModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule
} from "@angular/material";
import {TimbrageComponent} from './components/timbrage/timbrage.component';
import {LayoutModule} from '@angular/cdk/layout';
import {RouterModule, Routes} from "@angular/router";
import {CalendarComponent} from './components/calendar/calendar.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {TimeComponent} from './components/time/time.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {NgxsModule} from "@ngxs/store";
import {TimesState} from "./store/time.store";
import {MomentPipe} from "./pipes/moment.pipe";
import {TimesClientService} from "./services/times-client.service";
import {TimesLocalClientService} from "./services/times-local-client.service";
import {CalendarState} from "./store/calendar.store";
import {SettingsState} from "./store/settings.store";

const appRoutes: Routes = [
    {path: 'timbrage', component: TimbrageComponent},
    {path: 'calendar', component: CalendarComponent},
    {
        path: '',
        redirectTo: '/timbrage',
        pathMatch: 'full'
    }
];


@NgModule({
    declarations: [
        AppComponent,
        TimbrageComponent,
        CalendarComponent,
        TimeComponent,
        MomentPipe
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes),
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        // pwa
        ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
        // material
        FlexLayoutModule,
        BrowserAnimationsModule,
        MatTabsModule,
        MatIconModule,
        LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatInputModule,
        // ngxs
        NgxsModule.forRoot([TimesState, CalendarState, SettingsState])
    ],
    providers: [
        {provide: LOCALE_ID, useValue: 'fr'},
        {provide: TimesClientService, useClass: environment.client.in_memory ? TimesLocalClientService : TimesClientService}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}
