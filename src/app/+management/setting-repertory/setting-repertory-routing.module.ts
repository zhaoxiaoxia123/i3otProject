import { Routes, RouterModule } from '@angular/router';
import {SettingRepertoryComponent} from "./setting-repertory.component";

export const settingRepertoryComponentRoutes: Routes = [{
    path: '',
    component: SettingRepertoryComponent
}];
export const SettingRepertoryRoutingModule = RouterModule.forChild(settingRepertoryComponentRoutes);
