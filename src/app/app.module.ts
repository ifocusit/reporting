import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminSharedModule } from 'projects/admin/src/app/app.module';
import { TimbrageSharedModule } from 'projects/timbrage/src/app/app.module';
import { CommonsModule } from 'projects/commons/src/public-api';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, CommonsModule, AdminSharedModule.forRoot(), TimbrageSharedModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
