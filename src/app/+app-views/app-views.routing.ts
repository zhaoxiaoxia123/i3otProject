
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
];

export const routing = RouterModule.forChild(routes);
