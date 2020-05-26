import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonthComponent } from './month.component';

const routes: Routes = [
  {
    path: '',
    component: MonthComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthRoutingModule {}
