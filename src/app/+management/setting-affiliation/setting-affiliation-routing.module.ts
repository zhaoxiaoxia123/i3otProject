import { Routes, RouterModule } from '@angular/router';
import {SettingAffiliationComponent} from "./setting-affiliation.component";

export const settingAffiliationRoutes: Routes = [{
    path: '',
    component: SettingAffiliationComponent
}];
export const SettingAffiliationRoutingModule = RouterModule.forChild(settingAffiliationRoutes);
