import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule, TimesModule, ReportingCommonModule, SettingsModule } from 'projects/commons/src/public-api';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import { TimesState } from 'projects/commons/src/lib/times/time.store';
import { ProjectState } from 'projects/commons/src/lib/settings/project.store';
import { AngularFireModule } from '@angular/fire';
import { SettingsState } from 'projects/commons/src/lib/settings/settings.store';
import { SelectProjectModule } from 'projects/commons/src/lib/settings/select-project/select-project.module';

const providers = [];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    AppRoutingModule,
    ReportingCommonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AuthModule,
    TimesModule,
    SettingsModule,
    SelectProjectModule,
    NgxsModule.forRoot([TimesState, ProjectState, SettingsState], { developmentMode: !environment.production }),
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
