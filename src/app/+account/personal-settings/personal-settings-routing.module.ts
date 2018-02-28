import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PersonalSettingsComponent} from "./personal-settings.component";

export const PersonalSettingsRoutes: Routes = [{
    path: '',
    component: PersonalSettingsComponent
}];
export const PersonalSettingsRoutingModule = RouterModule.forChild(PersonalSettingsRoutes);