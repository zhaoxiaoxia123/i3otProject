import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProcurementOrderComponent} from "./procurement-order.component";


export const procurementOrderRoutes: Routes = [{
    path: '',
    component: ProcurementOrderComponent
}];
export const ProcurementOrderRoutingModule = RouterModule.forChild(procurementOrderRoutes);
