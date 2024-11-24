import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'month/:month',
    //   canActivate: [AuthGuard],
    loadChildren: () => import('./month/month.component').then(mod => mod.MonthComponent)
  }
];
