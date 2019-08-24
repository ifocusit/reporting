import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule, TimesModule, ReportingCommonModule, SettingsModule } from 'projects/commons/src/public-api';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { TimbrageComponent } from './components/timbrage/timbrage.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TimeComponent } from './components/time/time.component';
import { NgxsModule } from '@ngxs/store';
import { TimesState } from 'projects/commons/src/lib/times/time.store';
import { ProjectState } from 'projects/commons/src/lib/settings/project.store';

const providers = [];

@NgModule({
  declarations: [AppComponent, TimbrageComponent, CalendarComponent, ProfileComponent, TimeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    ReportingCommonModule,
    AuthModule,
    TimesModule,
    SettingsModule,
    NgxsModule.forRoot([TimesState, ProjectState], { developmentMode: !environment.production }),
    NgxsReduxDevtoolsPluginModule.forRoot()
  ],
  providers,
  bootstrap: [AppComponent]
})
export class AppModule {}

@NgModule({})
export class TimbrageSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppModule,
      providers
    };
  }
}
