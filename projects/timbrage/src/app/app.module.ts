import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonsModule } from 'projects/commons/src/public-api';
import { TimbrageComponent } from './components/timbrage/timbrage.component';

const providers = [];

@NgModule({
  declarations: [AppComponent, TimbrageComponent],
  imports: [BrowserModule, AppRoutingModule, CommonsModule],
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
