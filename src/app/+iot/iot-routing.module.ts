import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'station-block',
        loadChildren: 'app/+iot/station-block/station-block.module#StationBlockModule',
        data: {pageTitle: 'StationBlock'}
    },

];

export const routing = RouterModule.forChild(routes);