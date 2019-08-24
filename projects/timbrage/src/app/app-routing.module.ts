import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'projects/commons/src/lib/auth/auth.guard';
import { LoginComponent } from 'projects/commons/src/lib/auth/login/login.component';
import { TimbrageComponent } from './components/timbrage/timbrage.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: 'timbrage', canActivate: [AuthGuard], component: TimbrageComponent },
  { path: 'calendar', canActivate: [AuthGuard], component: CalendarComponent },
  { path: 'profile', canActivate: [AuthGuard], component: ProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/timbrage', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
