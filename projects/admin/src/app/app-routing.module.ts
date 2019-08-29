import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'projects/commons/src/lib/auth/auth.guard';

const routes: Routes = [
  {
    path: 'month/:month',
    canActivate: [AuthGuard],
    loadChildren: () => import('./components/month/month.module').then(mod => mod.MonthModule)
  },
  {
    path: 'bill/:month',
    canActivate: [AuthGuard],
    loadChildren: () => import('./components/bill/bill.module').then(mod => mod.BillModule)
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
  { path: '', redirectTo: '/profile', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
