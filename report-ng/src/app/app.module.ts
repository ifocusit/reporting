import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MonthComponent } from './page/month/month.component';
import { MomentPipe } from './pipe/moment/moment.pipe';
import { DurationPipe } from './pipe/moment/duration.pipe';


@NgModule({
  declarations: [
    AppComponent,
    MonthComponent,
    MomentPipe,
    DurationPipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
