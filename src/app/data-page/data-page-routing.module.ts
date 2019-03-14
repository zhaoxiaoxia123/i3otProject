import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'read-write-data',
        loadChildren: 'app/data-page/read-write-data/read-write-data.module#ReadWriteDataModule',
        data: {pageTitle: 'ReadWriteData'}
    }
];

export const routing = RouterModule.forChild(routes);