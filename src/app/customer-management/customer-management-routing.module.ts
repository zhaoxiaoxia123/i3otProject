import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'unit-classify',
        loadChildren: 'app/customer-management/unit-classify/unit-classify.module#UnitClassifyModule',
        data: {pageTitle: 'UnitClassify'}
    },
    {
        path: 'unit-list',
        loadChildren: 'app/customer-management/unit-list/unit-list.module#UnitListModule',
        data: {pageTitle: 'UnitList'}
    },
];

export const routing = RouterModule.forChild(routes);
