import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReportingCommonModule, AuthModule, SettingsModule, TimesModule } from 'projects/commons/src/public-api';
import { NgxsModule } from '@ngxs/store';
import { TimesState } from 'projects/commons/src/lib/times/time.store';
import { ProjectState } from 'projects/commons/src/lib/settings/project.store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { FilesModule } from 'projects/commons/src/lib/files/files.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { SettingsState } from 'projects/commons/src/lib/settings/settings.store';

const providers = [];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    ReportingCommonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AuthModule,
    SettingsModule,
    TimesModule,
    FilesModule,
    NgxsModule.forRoot([TimesState, ProjectState, SettingsState], { developmentMode: !environment.production }),
    NgxsReduxDevtoolsPluginModule.forRoot()
  ],
  providers,
  bootstrap: [AppComponent]
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
