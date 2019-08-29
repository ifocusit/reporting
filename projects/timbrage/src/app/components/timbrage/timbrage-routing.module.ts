import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimbrageComponent } from './timbrage.component';

const routes: Routes = [
  {
    path: '',
    component: TimbrageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimbrageRoutingModule {}
