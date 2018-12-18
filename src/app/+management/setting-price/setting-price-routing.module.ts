import { Routes, RouterModule } from '@angular/router';
import {SettingPriceComponent} from "./setting-price.component";

export const settingPriceRoutes: Routes = [{
    path: '',
    component: SettingPriceComponent
}];
export const SettingPriceRoutingModule = RouterModule.forChild(settingPriceRoutes);

