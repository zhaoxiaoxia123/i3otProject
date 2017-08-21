import {ModuleWithProviders} from "@angular/core"
import {Routes, RouterModule} from '@angular/router';


export const routes: Routes = [
  {
    path: '', redirectTo: 'social', pathMatch: 'full'
  },
  {
    path: 'social',
    loadChildren:'./+social/social.module#SocialModule',
  }
];

export const routing = RouterModule.forChild(routes);
