import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'unit-classify',
        loadChildren: 'app/+customer-management/unit-classify/unit-classify.module#UnitClassifyModule',
        data: {pageTitle: 'UnitClassify'}
    },
    {
        path: 'unit-list',
        loadChildren: 'app/+customer-management/unit-list/unit-list.module#UnitListModule',
        data: {pageTitle: 'UnitList'}
    },
    {
        path: 'customer-unit',
        loadChildren: 'app/+customer-management/customer-unit/customer-unit.module#CustomerUnitModule',
        data: {pageTitle: 'CustomerUnit'}
    },
];

export const routing = RouterModule.forChild(routes);
