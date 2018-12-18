import { Routes, RouterModule } from '@angular/router';
import {CommodityClassifyComponent} from "./commodity-classify.component";

export const CommodityClassifyRoutes: Routes = [{
    path: '',
    component: CommodityClassifyComponent
}];
export const CommodityClassifyRoutingModule = RouterModule.forChild(CommodityClassifyRoutes);
