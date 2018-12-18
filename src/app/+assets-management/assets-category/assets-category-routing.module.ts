import { Routes, RouterModule } from '@angular/router';
import {AssetsCategoryComponent} from "./assets-category.component";

export const assetsCategoryRoutes: Routes = [{
    path: '',
    component: AssetsCategoryComponent
}];
export const AssetsCategoryRoutingModule = RouterModule.forChild(assetsCategoryRoutes);
