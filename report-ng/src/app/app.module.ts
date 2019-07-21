import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MonthComponent } from './page/month/month.component';
import { MomentPipe } from './pipe/moment/moment.pipe';
import { DurationPipe } from './pipe/moment/duration.pipe';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatOptionModule,
  MatSelectModule,
  MatTableModule,
  MatToolbarModule,
  MatButtonToggleModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DailyReportComponent } from './page/month/daily-report/daily-report.component';
import { AuthComponent } from './page/auth/auth.component';
import { AuthGuardService } from './page/auth/auth-guard.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { NgxsModule } from '@ngxs/store';
import { TimesState } from './store/month.store';
import { DebounceInputDirective } from './directive/debounce-input.directive';

const appRoutes: Routes = [
  { path: 'auth', component: AuthComponent },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'home', canActivate: [AuthGuardService], component: HomeComponent },
  { path: 'month/:month', canActivate: [AuthGuardService], component: MonthComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MonthComponent,
    MomentPipe,
    DurationPipe,
    HomeComponent,
    DailyReportComponent,
    AuthComponent,
    DebounceInputDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false }),
    // material
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatTableModule,
    MatToolbarModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonToggleModule,
    // ngxs
    NgxsModule.forRoot([TimesState], { developmentMode: !environment.production }),
    // firebase
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [DailyReportComponent]
})
export class AppModule {}
