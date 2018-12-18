import { Routes, RouterModule } from '@angular/router';
import {SettingEnterpriseComponent} from './setting-enterprise.component';

export const settingEnterpriseRoutes: Routes = [{
    path: '',
    component: SettingEnterpriseComponent
}];
export const settingEnterpriseRouting = RouterModule.forChild(settingEnterpriseRoutes);
