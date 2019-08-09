import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimbrageComponent } from 'projects/timbrage/src/app/components/timbrage/timbrage.component';
import { BillComponent } from 'projects/admin/src/app/components/bill/bill.component';
import { AuthGuard } from 'projects/commons/src/lib/auth/auth.guard';
import { LoginComponent } from 'projects/commons/src/lib/auth/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'timbrage', canActivate: [AuthGuard], component: TimbrageComponent },
  { path: 'bill', canActivate: [AuthGuard], component: BillComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
