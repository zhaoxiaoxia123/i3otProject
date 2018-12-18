import { Routes, RouterModule } from '@angular/router';
import {SettingProduct3typeComponent} from './setting-product3type.component';

export const settingProduct3typeRoutes: Routes = [{
    path: '',
    component: SettingProduct3typeComponent
}];
export const SettingProduct3typeRoutingModule = RouterModule.forChild(settingProduct3typeRoutes);
