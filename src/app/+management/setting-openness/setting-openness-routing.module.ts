import { Routes, RouterModule } from '@angular/router';
import {SettingOpennessComponent} from "./setting-openness.component";

export const settingOpennessRoutes: Routes = [{
    path: '',
    component: SettingOpennessComponent
}];
export const SettingOpennessRoutingModule = RouterModule.forChild(settingOpennessRoutes);
