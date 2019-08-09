import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimbrageComponent } from './components/timbrage/timbrage.component';
import { AuthGuard } from 'projects/commons/src/lib/auth/auth.guard';
import { LoginComponent } from 'projects/commons/src/lib/auth/login/login.component';

const routes: Routes = [
  { path: 'timbrage', canActivate: [AuthGuard], component: TimbrageComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/timbrage', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
