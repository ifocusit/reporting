import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {MonthComponent} from './page/month/month.component';
import {MomentPipe} from './pipe/moment/moment.pipe';
import {DurationPipe} from './pipe/moment/duration.pipe';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './page/home/home.component';

const appRoutes: Routes = [
  {
    path: '', redirectTo: '/home', pathMatch: 'full'
  },
  {path: 'home', component: HomeComponent},
  {path: 'month/:month', component: MonthComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    MonthComponent,
    MomentPipe,
    DurationPipe,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, {enableTracing: false}
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
