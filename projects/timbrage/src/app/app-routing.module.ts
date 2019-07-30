import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimbrageComponent } from './components/timbrage/timbrage.component';

const routes: Routes = [{ path: 'timbrage', component: TimbrageComponent }, { path: '', redirectTo: '/timbrage', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
