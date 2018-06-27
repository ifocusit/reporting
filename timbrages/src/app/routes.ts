import { ReportComponent } from './report/report.component';
import { TimbrageComponent } from "./timbrage/timbrage.component";
import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: '', redirectTo: '/timbrage', pathMatch: 'full' },
  {
    path: 'timbrage',
    component: TimbrageComponent
  },
  {
    path: 'report',
    component: ReportComponent
  }
];
