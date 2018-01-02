import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppOrderComponent} from "./app-order.component";


export const appOrderRoutes: Routes = [{
    path: '',
    component: AppOrderComponent
}];
export const AppOrderRoutingModule = RouterModule.forChild(appOrderRoutes);