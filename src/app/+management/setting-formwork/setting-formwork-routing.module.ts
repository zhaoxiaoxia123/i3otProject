import { Routes, RouterModule } from '@angular/router';
import {SettingFormworkComponent} from "./setting-formwork.component";

export const settingFormworkRoutes: Routes = [{
    path: '',
    component: SettingFormworkComponent
}];
export const SettingFormworkRoutingModule = RouterModule.forChild(settingFormworkRoutes);
