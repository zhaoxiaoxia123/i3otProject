import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EquipmentPositioningComponent} from './equipment-positioning/equipment-positioning.component';
import {EquipmentBeaconComponent} from './equipment-beacon/equipment-beacon.component';
import {HelmetDetailsComponent} from './helmet-details/helmet-details.component';
import {HelmetListComponent} from './helmet-list/helmet-list.component';
import {StationDetailsComponent} from './station-details/station-details.component';
import {StationListComponent} from './station-list/station-list.component';

export const routes:Routes = [
    {
        path: 'equipment-positioning',
        component: EquipmentPositioningComponent
    },
    {
        path: 'equipment-beacon',
        component: EquipmentBeaconComponent
    },
    {
        path: 'helmet-details',
        component: HelmetDetailsComponent
    },
    {
        path: 'helmet-list',
        component: HelmetListComponent
    },
    {
        path: 'station-details',
        component: StationDetailsComponent
    },
    {
        path: 'station-list',
        component: StationListComponent
    },

];

export const routing = RouterModule.forChild(routes)
