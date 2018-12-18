import { Routes, RouterModule } from '@angular/router';
import {AssetsReturnComponent} from "./assets-return.component";

export const assetsReturnRoutes: Routes = [{
    path: '',
    component: AssetsReturnComponent
}];
export const AssetsReturnRoutingModule = RouterModule.forChild(assetsReturnRoutes);
