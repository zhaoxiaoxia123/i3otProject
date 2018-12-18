import {Routes, RouterModule} from '@angular/router';

export const routes: Routes = [
  {
    path: '', redirectTo: 'social', pathMatch: 'full'
  },
    {
        path: 'dynamic-wall',
        loadChildren:'./dynamic-wall/dynamic-wall.module#DynamicWallModule',
    },
    {
        path: 'social',
        loadChildren:'./+social/social.module#SocialModule',
    }
];
export const routing = RouterModule.forChild(routes);
