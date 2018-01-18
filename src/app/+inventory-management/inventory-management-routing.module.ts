import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'inventory-classification',
        loadChildren: 'app/+inventory-management/inventory-classification/inventory-classification.module#InventoryClassificationModule',
        data: {pageTitle: 'InventoryClassification'}
    },
    {
        path: 'inventory-requisition',
        loadChildren: 'app/+inventory-management/inventory-requisition/inventory-requisition.module#InventoryRequisitionModule',
        data: {pageTitle: 'InventoryRequisition'}
    },
    {
        path: 'add-requisition/:stock_allot_id',
        loadChildren: 'app/+inventory-management/add-requisition/add-requisition.module#AddRequisitionModule',
        data: {pageTitle: 'AddRequisition'}
    },
];

export const routing = RouterModule.forChild(routes);