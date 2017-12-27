import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'inventory-classification',
        loadChildren: 'app/+inventory-management/inventory-classification/inventory-classification.module#InventoryClassificationModule',
        data: {pageTitle: 'InventoryClassification'}
    },
    {
        path: 'effect-tabe',
        loadChildren: 'app/+inventory-management/effect-tabe/effect-tabe.module#EffectTabeModule',
        data: {pageTitle: 'EffectTabe'}
    },
    {
        path: 'effect-test',
        loadChildren: 'app/+inventory-management/effect-test/effect-test.module#EffectTestModule',
        data: {pageTitle: 'EffectTest'}
    },
    {
        path: 'inventory-requisition',
        loadChildren: 'app/+inventory-management/inventory-requisition/inventory-requisition.module#InventoryRequisitionModule',
        data: {pageTitle: 'InventoryRequisition'}
    },
    {
        path: 'add-requisition',
        loadChildren: 'app/+inventory-management/add-requisition/add-requisition.module#AddRequisitionModule',
        data: {pageTitle: 'AddRequisition'}
    },
];

export const routing = RouterModule.forChild(routes);