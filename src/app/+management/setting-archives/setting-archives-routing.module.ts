import { Routes, RouterModule } from '@angular/router';
import {SettingArchivesComponent} from "./setting-archives.component";

export const settingArchivesRoutes: Routes = [{
    path: '',
    component: SettingArchivesComponent
}];
export const SettingArchivesRoutingModule = RouterModule.forChild(settingArchivesRoutes);
