import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillComponent } from './components/bill/bill.component';
import { AuthGuard } from 'projects/commons/src/lib/auth/auth.guard';

const routes: Routes = [{ path: 'bill', component: BillComponent }, { path: '', redirectTo: '/bill', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
