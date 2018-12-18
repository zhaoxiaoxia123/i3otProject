import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'add-sales/:pr_id',
        loadChildren: 'app/+sales-management/add-sales/add-sales.module#AddSalesModule',
        data: {pageTitle: 'AddSales'}
    },
    {
        path: 'sales-list',
        loadChildren: 'app/+sales-management/sales-list/sales-list.module#SalesListModule',
        data: {pageTitle: 'SalesList'}
    },
    {
        path: 'sales-type',
        loadChildren: 'app/+sales-management/sales-type/sales-type.module#SalesTypeModule',
        data: {pageTitle: 'SalesType'}
    },
];

export const routing = RouterModule.forChild(routes);
