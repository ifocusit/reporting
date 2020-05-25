import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { ErrorsHandlingModule } from 'projects/commons/src/lib/error/errors-handling.module';
import { FilesModule } from 'projects/commons/src/lib/files/files.module';
import { SettingsState } from 'projects/commons/src/lib/settings/settings.store';
import { TimesState } from 'projects/commons/src/lib/times/time.store';
import { AuthModule, ReportingCommonModule, SettingsModule, TimesModule } from 'projects/commons/src/public-api';
import { HttpLoaderFactory } from 'projects/timbrage/src/app/app.module';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    NgxsModule.forRoot([TimesState, SettingsState], { developmentMode: !environment.production }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot(),
    AppRoutingModule,
    ReportingCommonModule,
    AuthModule,
    SettingsModule,
    TimesModule,
    FilesModule,
    ErrorsHandlingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HammerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
