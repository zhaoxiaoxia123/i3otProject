import { Routes, RouterModule } from '@angular/router';
import {SettingHonorComponent} from "./setting-honor.component";

export const settingHonorRoutes: Routes = [{
    path: '',
    component: SettingHonorComponent
}];
export const SettingHonorRoutingModule = RouterModule.forChild(settingHonorRoutes);
