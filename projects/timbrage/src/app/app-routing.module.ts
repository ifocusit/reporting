import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'projects/commons/src/lib/auth/auth.guard';

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
