import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InitiateLeaveComponent} from "./initiate-leave.component";

export const InitiateLeaveRoutes: Routes = [{
    path: '',
    component: InitiateLeaveComponent
}];
export const InitiateLeaveRoutingModule = RouterModule.forChild(InitiateLeaveRoutes);


