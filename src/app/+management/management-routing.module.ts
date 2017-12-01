import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes:Routes = [
    {
        path: 'enterprise',
        loadChildren: 'app/+management/setting-enterprise/setting-enterprise.module#SettingEnterpriseModule',
        data: {pageTitle: 'Setting Enterprise'}
    },
    {
        path: 'enterprise1',
        loadChildren: 'app/+management/setting-enterprise1/setting-enterprise1.module#SettingEnterprise1Module',
        data: {pageTitle: 'Setting Enterprise1'}
    },
    {
        path: 'enterprise2',
        loadChildren: 'app/+management/setting-enterprise2/setting-enterprise2.module#SettingEnterprise2Module',
        data: {pageTitle: 'Setting Enterprise2'}
    },
    {
        path: 'department',
        loadChildren: 'app/+management/setting-department/setting-department.module#SettingDepartmentModule',
        data: {pageTitle: 'Setting Department'}
    },
    {
        path: 'product3type',
        loadChildren: 'app/+management/setting-product3type/setting-product3type.module#SettingProduct3typeModule',
        data: {pageTitle: 'Setting Product3type'}
    },
    {
        path: 'setting-equipment',
        loadChildren: 'app/+management/setting-equipment/setting-equipment.module#SettingEquipmentModule',
        data: {pageTitle: 'Setting Equipment'}
    },
    {
        path: 'product4parameters',
        loadChildren: 'app/+management/setting-product4parameters/setting-product4parameters.module#SettingProduct4parametersModule',
        data: {pageTitle: 'Setting Product4parameters'}
    }
];

export const routing = RouterModule.forChild(routes);