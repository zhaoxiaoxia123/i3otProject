import { Routes, RouterModule } from '@angular/router';
import {AssetsScrapComponent} from "./assets-scrap.component";

export const assetsScrapRoutes: Routes = [{
    path: '',
    component: AssetsScrapComponent
}];
export const AssetsScrapRoutingModule = RouterModule.forChild(assetsScrapRoutes);
