import { Routes } from '@angular/router';
import {AuthGuard} from '../guards/auth-guard.service';


export const routes: Routes = [

    { path: 'forgot-password', loadChildren: '../app/modules/forgot-password/forgot-password.module#ForgotPasswordModule' },
    { path: 'logout', loadChildren: '../app/modules/login/login.module#LoginModule' },
    { path: 'login', loadChildren: '../app/modules/login/login.module#LoginModule' },
    { path: 'user', loadChildren: '../app/modules/signup/signup.module#SignupModule' },
   // { path: 'activate/:username', loadChildren: '../app/modules/activation/activation.module#ActivationModule' },
    { path: 'dashboard', loadChildren: '../app/modules/dashboard/dashboard.module#DashboardModule', canActivate:[AuthGuard]},
    { path: '', loadChildren: '../app/modules/dashboard/dashboard.module#DashboardModule' },
];

