
import {RouterModule, Routes} from "@angular/router";


export const routes:Routes = [
  {
    path: 'profile',
    loadChildren: './+profile/profile.module#ProfileModule'
  },

];

export const routing = RouterModule.forChild(routes);
