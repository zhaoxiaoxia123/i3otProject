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
    {
        path: 'commodity-classify',
        loadChildren: 'app/+inventory-management/commodity-classify/commodity-classify.module#CommodityClassifyModule',
        data: {pageTitle: 'CommodityClassify'}
    },
    {
        path: 'add-outbound/:otherorder_id',
        loadChildren: 'app/+inventory-management/add-outbound/add-outbound.module#AddOutboundModule',
        data: {pageTitle: 'AddOutbound'}
    },
    {
        path: 'add-storage/:otherorder_id',
        loadChildren: 'app/+inventory-management/add-storage/add-storage.module#AddStorageModule',
        data: {pageTitle: 'AddStorage'}
    },
    {
        path: 'inventory-early',
        loadChildren: 'app/+inventory-management/inventory-early/inventory-early.module#InventoryEarlyModule',
        data: {pageTitle: 'InventoryEarly'}
    },
    {
        path: 'outbound',
        loadChildren: 'app/+inventory-management/outbound/outbound.module#OutboundModule',
        data: {pageTitle: 'Outbound'}
    },
    {
        path: 'storage',
        loadChildren: 'app/+inventory-management/storage/storage.module#StorageModule',
        data: {pageTitle: 'Storage'}
    },
];

export const routing = RouterModule.forChild(routes);