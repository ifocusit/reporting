import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MonthComponent } from './page/month/month.component';
import { MomentPipe } from './pipe/moment/moment.pipe';
import { DurationPipe } from './pipe/moment/duration.pipe';
import { RouterModule, Routes } from '@angular/router';
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
  MatButtonToggleModule,
  MatTabsModule,
  MatProgressBarModule
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
import { BillComponent } from './page/bill/bill.component';
import { ProfileComponent } from './page/profile/profile.component';
import { SettingsState } from './store/settings.store';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { DropZoneDirective } from './component/drop-zone.directive';
import { FileUploadComponent } from './component/file-upload/file-upload.component';
import { FileSizePipe } from './component/file-size.pipe';

const appRoutes: Routes = [
  { path: 'auth', component: AuthComponent },
  {
    path: '',
    redirectTo: '/profile',
    pathMatch: 'full'
  },
  { path: 'month/:month', canActivate: [AuthGuardService], component: MonthComponent },
  { path: 'bill/:month', canActivate: [AuthGuardService], component: BillComponent },
  { path: 'profile', canActivate: [AuthGuardService], component: ProfileComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MonthComponent,
    MomentPipe,
    DurationPipe,
    DailyReportComponent,
    AuthComponent,
    DebounceInputDirective,
    BillComponent,
    ProfileComponent,
    DropZoneDirective,
    FileUploadComponent,
    FileSizePipe
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
    MatTabsModule,
    MatProgressBarModule,
    // ngxs
    NgxsModule.forRoot([TimesState, SettingsState], { developmentMode: !environment.production }),
    // firebase
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [DailyReportComponent]
})
export class AppModule {}
