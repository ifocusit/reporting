import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatTabsModule,
  MatToolbarModule
} from "@angular/material";
import {TimbrageComponent} from './timbrage/timbrage.component';
import {LayoutModule} from '@angular/cdk/layout';
import {RouterModule, Routes} from "@angular/router";
import {CalendarComponent} from './calendar/calendar.component';
import {FlexLayoutModule} from "@angular/flex-layout";

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
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
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
  ],
  providers: [{provide: LOCALE_ID, useValue: 'fr'}],
  bootstrap: [AppComponent]
})
export class AppModule {

}
