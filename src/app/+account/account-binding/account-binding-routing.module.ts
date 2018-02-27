import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AccountBindingComponent} from "./account-binding.component";


export const AccountBindingRoutes: Routes = [{
    path: '',
    component: AccountBindingComponent
}];
export const AccountBindingRoutingModule = RouterModule.forChild(AccountBindingRoutes);
