import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AssetsListingComponent} from "./assets-listing.component";


export const assetsListingRoutes: Routes = [{
    path: '',
    component: AssetsListingComponent
}];
export const AssetsListingRoutingModule = RouterModule.forChild(assetsListingRoutes);
