import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BillComponent } from './components/bill/bill.component';
import { CommonsModule } from 'projects/commons/src/public-api';

const providers = [];

@NgModule({
  declarations: [AppComponent, BillComponent],
  imports: [BrowserModule, AppRoutingModule, CommonsModule],
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
