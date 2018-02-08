import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AccountPasswordComponent} from "./account-password.component";

export const AccountPasswordRoutes: Routes = [{
    path: '',
    component: AccountPasswordComponent
}];
export const AccountPasswordRoutingModule = RouterModule.forChild(AccountPasswordRoutes);
