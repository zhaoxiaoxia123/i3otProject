import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'todo-message',
        loadChildren: 'app/+to-do/todo-message/todo-message.module#TodoMessageModule',
        data: {pageTitle: 'TodoMessage'}
    },
    {
        path: 'todo-workbench',
        loadChildren: 'app/+to-do/todo-workbench/todo-workbench.module#TodoWorkbenchModule',
        data: {pageTitle: 'TodoWorkbench'}
    },
];

export const routing = RouterModule.forChild(routes);
