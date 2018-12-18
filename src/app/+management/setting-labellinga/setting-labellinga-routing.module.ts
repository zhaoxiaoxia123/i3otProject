import { Routes, RouterModule } from '@angular/router';
import {SettingLabellingaComponent} from "./setting-labellinga.component";

export const settingLabellingaRoutes: Routes = [{
    path: '',
    component: SettingLabellingaComponent
}];
export const SettingLabellingaRoutingModule = RouterModule.forChild(settingLabellingaRoutes);