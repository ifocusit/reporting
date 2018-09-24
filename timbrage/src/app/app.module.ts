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
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {NgxsModule} from "@ngxs/store";
import {TimesState} from "./store/time.store";

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
        TimeComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes),
        HttpClientModule,
        ReactiveFormsModule,
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
        // ngxs
        NgxsModule.forRoot([TimesState])
    ],
    providers: [{provide: LOCALE_ID, useValue: 'fr'}],
    bootstrap: [AppComponent]
})
export class AppModule {

}
