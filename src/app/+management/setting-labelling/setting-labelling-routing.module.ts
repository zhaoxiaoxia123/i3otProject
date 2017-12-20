import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SettingLabellingComponent} from "./setting-labelling.component";


export const settingLabellingRoutes: Routes = [{
    path: '',
    component: SettingLabellingComponent
}];
export const SettingLabellingRoutingModule = RouterModule.forChild(settingLabellingRoutes);
