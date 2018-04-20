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
        path: '', redirectTo: 'index', pathMatch: 'full'
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
        path: 'app-views',
        loadChildren: 'app/+app-views/app-views.module#AppViewsModule',
        data: {pageTitle: 'App Views'}
      },
      {
        path: 'miscellaneous',
        loadChildren: 'app/+miscellaneous/miscellaneous.module#MiscellaneousModule',
        data: {pageTitle: 'Miscellaneous'}
      },
      {
          path: 'equipment',
          loadChildren: 'app/+equipment/equipment.module#EquipmentModule',
          data: {pageTitle: 'Equipment'}
      },
        {
            path: 'assets-management',
            loadChildren: 'app/+assets-management/assets-management.module#AssetsManagementModule',
            data: {pageTitle: 'AssetsManagement'}
        },
        {
            path: 'inventory-management',
            loadChildren: 'app/+inventory-management/inventory-management.module#InventoryManagementModule',
            data: {pageTitle: 'InventoryManagement'}
        },
        {
            path: 'customer-management',
            loadChildren: 'app/+customer-management/customer-management.module#CustomerManagementModule',
            data: {pageTitle: 'CustomerManagement'}
        },
        {
            path: 'sales-management',
            loadChildren: 'app/+sales-management/sales-management.module#SalesManagementModule',
            data: {pageTitle: 'SalesManagement'}
        },
        {
            path: 'procurement-management',
            loadChildren: 'app/+procurement-management/procurement-management.module#ProcurementManagementModule',
            data: {pageTitle: 'ProcurementManagement'}
        },
        {
            path: 'account',
            loadChildren: 'app/+account/account.module#AccountModule',
            data: {pageTitle: 'Account'}
        },
        {
            path: 'to-do',
            loadChildren: 'app/+to-do/to-do.module#ToDoModule',
            data: {pageTitle: 'ToDo'}
        },
        {
            path: 'process',
            loadChildren: 'app/+process/process.module#ProcessModule',
            data: {pageTitle: 'Process'}
        },
        {
            path: 'file',
            loadChildren: 'app/+file/file.module#FileModule',
            data: {pageTitle: 'File'}
        },
        {
            path: 'mail',
            loadChildren: 'app/+mail/mail.module#MailModule',
            data: {pageTitle: 'Mail'}
        },
        {
            path: 'medical',
            loadChildren: 'app/+medical/medical.module#MedicalModule',
            data: {pageTitle: 'Medical'}
        },
        {
            path: 'iot',
            loadChildren: 'app/+iot/iot.module#IotModule',
            data: {pageTitle: 'Iot'}
        }
    ]
  },
    {path: 'auth', component: AuthLayoutComponent, loadChildren: 'app/+auth/auth.module#AuthModule'},
  // {path: '**', redirectTo: 'miscellaneous/error404'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
