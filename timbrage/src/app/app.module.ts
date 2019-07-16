import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
} from '@angular/material';
import { TimbrageComponent } from './components/timbrage/timbrage.component';
import { LayoutModule } from '@angular/cdk/layout';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TimeComponent } from './components/time/time.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { MomentPipe } from './pipes/moment.pipe';
import { SettingsState } from './store/settings.store';
import { DurationPipe } from './pipes/duration.pipe';
import { HomeComponent } from './components/home/home.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthComponent } from './components/auth/auth.component';
import { TimesState } from './store/time.store';
import { localStorageProviders, StorageModule } from '@ngx-pwa/local-storage';

const appRoutes: Routes = [
  { path: 'auth', component: AuthComponent },
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'timbrage', canActivate: [AuthGuardService], component: TimbrageComponent },
      { path: 'calendar', canActivate: [AuthGuardService], component: CalendarComponent },
      { path: '', redirectTo: '/timbrage', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    TimbrageComponent,
    CalendarComponent,
    TimeComponent,
    MomentPipe,
    DurationPipe,
    HomeComponent,
    SidenavComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    // pwa
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
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
    NgxsModule.forRoot([TimesState, SettingsState], { developmentMode: !environment.production }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    // firebase
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    // old localstorage
    StorageModule.forRoot({ LSPrefix: 'timbrage_', IDBDBName: 'timbrage_ngStorage' })
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
  bootstrap: [AppComponent]
})
export class AppModule {}
