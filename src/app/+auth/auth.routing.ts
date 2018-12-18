import {Routes, RouterModule} from "@angular/router";

export const routes:Routes = [
  {
    path: 'login',
    loadChildren: './+login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: './+register/register.module#RegisterModule'
  },
  {
    path: 'forgot-password',
    loadChildren: './+forgot/forgot.module#ForgotModule'
  },
    {
        path: 'homepage',
        loadChildren: './homepage/homepage.module#HomepageModule'
    },
    {
        path: 'form-binding',
        loadChildren: './form-binding/form-binding.module#FormBindingModule'
    },
  {
    path: 'locked',
    loadChildren: './+locked/locked.module#LockedModule'
  }
];

export const routing = RouterModule.forChild(routes);
