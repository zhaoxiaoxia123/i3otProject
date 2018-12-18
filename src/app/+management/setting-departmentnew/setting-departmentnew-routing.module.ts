import { Routes, RouterModule } from '@angular/router';
import {SettingDepartmentnewComponent} from "./setting-departmentnew.component";

export const settingDepartmentnewRoutes: Routes = [{
    path: '',
    component: SettingDepartmentnewComponent
}];
export const SettingDepartmentnewRoutingModule = RouterModule.forChild(settingDepartmentnewRoutes);
