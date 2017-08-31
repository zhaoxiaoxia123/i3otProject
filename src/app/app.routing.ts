/**
 * Created by griga on 7/11/16.
 */
import {Routes, RouterModule} from '@angular/router';
import {MainLayoutComponent} from "./shared/layout/app-layouts/main-layout.component";
import {AuthLayoutComponent} from "./shared/layout/app-layouts/auth-layout.component";
import {ModuleWithProviders} from "@angular/core";
import {HomeComponent} from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    data: {pageTitle: 'Home'},
    children: [
      {
        path: '', redirectTo: 'dashboard/social', pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: 'app/+dashboard/dashboard.module#DashboardModule',
        data: {pageTitle: 'Dashboard'}
      },
        {
            path: 'tables',
            loadChildren: 'app/+tables/tables.module#TablesModule',
            data: {pageTitle: 'Tables'}
        },
      {
        path: 'forms',
        loadChildren: 'app/+forms/forms-showcase.module#FormsShowcaseModule',
        data: {pageTitle: 'Forms'}
      },
        {
            path: 'management',
            loadChildren: 'app/+management/management.module#ManagementModule',
            data: {pageTitle: 'Management'}
        },
      {
        path: 'graphs',
        loadChildren: 'app/+graphs/graphs-showcase.module#GraphsShowcaseModule',
        data: {pageTitle: 'Graphs'}
      },
      {
        path: 'miscellaneous',
        loadChildren: 'app/+miscellaneous/miscellaneous.module#MiscellaneousModule',
        data: {pageTitle: 'Miscellaneous'}
      },
    ]
  },
  {path: 'auth', component: AuthLayoutComponent, loadChildren: 'app/+auth/auth.module#AuthModule'},
  // {path: '**', redirectTo: 'miscellaneous/error404'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
