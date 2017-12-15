
import {RouterModule, Routes} from "@angular/router";


export const routes:Routes = [
  {
    path: 'profile',
    loadChildren: './+profile/profile.module#ProfileModule'
  },
  {
        path: 'helmet-projects',
        loadChildren: './helmet-projects/helmet-projects.module#HelmetProjectsModule'
  },
    {
        path: 'todo-projects',
        loadChildren: './todo-projects/todo-projects.module#TodoProjectsModule'
    },
];

export const routing = RouterModule.forChild(routes);
