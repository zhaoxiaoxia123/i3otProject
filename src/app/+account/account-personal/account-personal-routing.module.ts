import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AccountPersonalComponent} from "./account-personal.component";

export const AccountPersonalRoutes: Routes = [{
    path: '',
    component: AccountPersonalComponent
}];
export const AccountPersonalRoutingModule = RouterModule.forChild(AccountPersonalRoutes);
