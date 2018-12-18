import { Routes, RouterModule } from '@angular/router';
import {SettingEnterprise2Component} from './setting-enterprise2.component';

export const settingEnterprise2Routes: Routes = [{
    path: '',
    component: SettingEnterprise2Component
}];
export const SettingEnterprise2RoutingModule = RouterModule.forChild(settingEnterprise2Routes);
