import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { SelectProjectModule } from 'projects/commons/src/lib/settings/select-project/select-project.module';
import { SettingsState } from 'projects/commons/src/lib/settings/settings.store';
import { TimesState } from 'projects/commons/src/lib/times/time.store';
import { AuthModule, ReportingCommonModule, SettingsModule, TimesModule } from 'projects/commons/src/public-api';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
    NgxsModule.forRoot([TimesState, SettingsState], { developmentMode: !environment.production }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
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

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
