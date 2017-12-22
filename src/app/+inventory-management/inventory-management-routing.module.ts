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
];

export const routing = RouterModule.forChild(routes);