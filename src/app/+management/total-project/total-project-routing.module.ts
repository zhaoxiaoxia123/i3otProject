import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TotalProjectComponent} from "./total-project.component";


export const totalProjectRoutes: Routes = [{
    path: '',
    component: TotalProjectComponent
}];
export const TotalProjectRoutingModule = RouterModule.forChild(totalProjectRoutes);
