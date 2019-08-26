import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'projects/commons/src/lib/auth/auth.guard';
import { LoginComponent } from 'projects/commons/src/lib/auth/login/login.component';
import { BillComponent } from './components/bill/bill.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MonthComponent } from './components/month/month.component';

const routes: Routes = [
  { path: 'month/:month', canActivate: [AuthGuard], component: MonthComponent },
  { path: 'bill/:month', canActivate: [AuthGuard], component: BillComponent },
  { path: 'profile', canActivate: [AuthGuard], component: ProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/profile', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
