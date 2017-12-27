import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
export const routes: Routes = [
    {
        path: 'add-receipt',
        loadChildren: 'app/+procurement-management/add-receipt/add-receipt.module#AddReceiptModule',
        data: {pageTitle: 'AddReceipt'}
    },
    {
        path: 'procurement-receipt',
        loadChildren: 'app/+procurement-management/procurement-receipt/procurement-receipt.module#ProcurementReceiptModule',
        data: {pageTitle: 'ProcurementReceipt'}
    },
    {
        path: 'procurement-type',
        loadChildren: 'app/+procurement-management/procurement-type/procurement-type.module#ProcurementTypeModule',
        data: {pageTitle: 'ProcurementType'}
    },
];

export const routing = RouterModule.forChild(routes);
