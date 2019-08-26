import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BillComponent } from './components/bill/bill.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MonthComponent } from './components/month/month.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ReportingCommonModule, AuthModule, SettingsModule, TimesModule } from 'projects/commons/src/public-api';
import { NgxsModule } from '@ngxs/store';
import { TimesState } from 'projects/commons/src/lib/times/time.store';
import { ProjectState } from 'projects/commons/src/lib/settings/project.store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { FilesModule } from 'projects/commons/src/lib/files/files.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DailyReportComponent } from './components/month/daily-report/daily-report.component';
import { AngularFireModule } from '@angular/fire';

const providers = [];

@NgModule({
  declarations: [AppComponent, BillComponent, MonthComponent, ProfileComponent, DailyReportComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    ReportingCommonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AuthModule,
    SettingsModule,
    TimesModule,
    FilesModule,
    NgxsModule.forRoot([TimesState, ProjectState], { developmentMode: !environment.production }),
    NgxsReduxDevtoolsPluginModule.forRoot()
  ],
  providers,
  bootstrap: [AppComponent],
  entryComponents: [DailyReportComponent]
})
export class AppModule {}

@NgModule({})
export class AdminSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppModule,
      providers
    };
  }
}
