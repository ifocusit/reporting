import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'projects/commons/src/lib/auth/auth.guard';
import { LoginComponent } from 'projects/commons/src/lib/auth/login/login.component';
import { TimbrageComponent } from './components/timbrage/timbrage.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {
    path: 'timbrage',
    canActivate: [AuthGuard],
    loadChildren: () => import('./components/timbrage/timbrage.module').then(mod => mod.TimbrageModule)
  },
  {
    path: 'calendar',
    canActivate: [AuthGuard],
    loadChildren: () => import('./components/calendar/calendar.module').then(mod => mod.CalendarModule)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./components/profile/profile.module').then(mod => mod.ProfileModule)
  },
  {
    path: 'login',
    loadChildren: () => import('projects/commons/src/lib/auth/login/login.module').then(mod => mod.LoginModule)
  },
  { path: '', redirectTo: '/timbrage', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
