// import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EquipmentPositioningComponent} from './equipment-positioning/equipment-positioning.component';
import {EquipmentBeaconComponent} from './equipment-beacon/equipment-beacon.component';
import {HelmetDetailsComponent} from './helmet-details/helmet-details.component';
import {HelmetListComponent} from './helmet-list/helmet-list.component';
import {StationDetailsComponent} from './station-details/station-details.component';
import {StationListComponent} from './station-list/station-list.component';
import {AddI3otpComponent} from './add-i3otp/add-i3otp.component';

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
        path: 'helmet-list',
        component: HelmetListComponent
    },
    {
        path: 'station-list',
        component: StationListComponent
    },
    {
        path: 'i3otp/:i_id',
        component: AddI3otpComponent
    },
];

export const routing = RouterModule.forChild(routes)
