import { Routes, RouterModule } from '@angular/router';
import {SettingEnterprise1Component} from './setting-enterprise1.component';

export const settingEnterprise1Routes: Routes = [{
    path: '',
    component: SettingEnterprise1Component
}];
export const SettingEnterprise1RoutingModule = RouterModule.forChild(settingEnterprise1Routes);
