import { Routes, RouterModule } from '@angular/router';
import {AssetsStatisticalComponent} from "./assets-statistical.component";

export const assetsStatisticalRoutes: Routes = [{
    path: '',
    component: AssetsStatisticalComponent
}];
export const AssetsStatisticalRoutingModule = RouterModule.forChild(assetsStatisticalRoutes);
