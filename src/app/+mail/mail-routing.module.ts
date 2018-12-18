import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'my-mail',
        loadChildren: 'app/+mail/my-mail/my-mail.module#MyMailModule',
        data: {pageTitle: 'MyMail'}
    },
];

export const routing = RouterModule.forChild(routes);
