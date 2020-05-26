import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@ifocusit/commons';

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
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./components/home/home.module').then(mod => mod.HomeModule)
  },
  {
    path: 'login',
    loadChildren: () => import('@ifocusit/commons').then(mod => mod.LoginModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
