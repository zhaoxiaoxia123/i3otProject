import { Routes, RouterModule } from '@angular/router';
import {SettingPersonnelComponent} from "./setting-personnel.component";

export const SettingPersonnelRoutes: Routes = [{
    path: '',
    component: SettingPersonnelComponent
}];
export const SettingPersonnelRoutingModule = RouterModule.forChild(SettingPersonnelRoutes);