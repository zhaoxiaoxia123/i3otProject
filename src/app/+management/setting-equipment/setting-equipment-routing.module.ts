import { Routes, RouterModule } from '@angular/router';
import {SettingEquipmentComponent} from "./setting-equipment.component";

export const SettingEquipmentRoutes: Routes = [{
    path: '',
    component: SettingEquipmentComponent
}];
export const SettingEquipmentRoutingModule = RouterModule.forChild(SettingEquipmentRoutes);
