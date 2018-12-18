import { Routes, RouterModule } from '@angular/router';
import {SettingConversionComponent} from "./setting-conversion.component";

export const settingConversionRoutes: Routes = [{
    path: '',
    component: SettingConversionComponent
}];
export const SettingConversionRoutingModule = RouterModule.forChild(settingConversionRoutes);
