import { Routes, RouterModule } from '@angular/router';
import {SettingDepartmentComponent} from './setting-department.component';

export const settingDepartmentRoutes: Routes = [{
    path: '',
    component: SettingDepartmentComponent
}];
export const SettingDepartmentRoutingModule = RouterModule.forChild(settingDepartmentRoutes);
