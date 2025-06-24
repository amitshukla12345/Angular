import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { AuthGuard } from './auth.guard';
import { RateUsComponent } from './rate-us/rate-us.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashbordComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./user/user.component').then(m => m.UserComponent)
      },
      {
        path: 'rate-us',
        component: RateUsComponent
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('../admin-view.component').then(m => m.AdminViewComponent),
        canActivate: [AuthGuard]
      }
    ]
  }
];
