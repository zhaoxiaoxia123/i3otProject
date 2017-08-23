import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes:Routes = [
    {
        path: 'enterprise',
        loadChildren: 'app/+management/setting-enterprise/setting-enterprise.module#SettingEnterpriseModule',
        data: {pageTitle: 'Setting Enterprise'}
    }
];

export const routing = RouterModule.forChild(routes);