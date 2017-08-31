import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SettingProduct4parametersComponent} from './setting-product4parameters.component';


export const settingProduct4parametersRoutes: Routes = [{
    path: '',
    component: SettingProduct4parametersComponent
}];
export const SettingProduct4parametersRoutingModule = RouterModule.forChild(settingProduct4parametersRoutes);
