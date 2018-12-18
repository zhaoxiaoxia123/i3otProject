import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'my-file',
        loadChildren: 'app/+file/my-file/my-file.module#MyFileModule',
        data: {pageTitle: 'MyFile'}
    },
];

export const routing = RouterModule.forChild(routes);