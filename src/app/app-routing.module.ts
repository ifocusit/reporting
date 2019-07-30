import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimbrageComponent } from 'projects/timbrage/src/app/components/timbrage/timbrage.component';
import { BillComponent } from 'projects/admin/src/app/components/bill/bill.component';

const routes: Routes = [{ path: 'timbrage', component: TimbrageComponent }, { path: 'bill', component: BillComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
