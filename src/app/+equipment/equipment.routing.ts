
import { Routes, RouterModule } from '@angular/router';
import {EquipmentPositioningComponent} from './equipment-positioning/equipment-positioning.component';
import {EquipmentBeaconComponent} from './equipment-beacon/equipment-beacon.component';
import {HelmetDetailsComponent} from './helmet-details/helmet-details.component';
import {HelmetListComponent} from './helmet-list/helmet-list.component';
import {StationDetailsComponent} from './station-details/station-details.component';
import {StationListComponent} from './station-list/station-list.component';
import {AddI3otpComponent} from './add-i3otp/add-i3otp.component';
import {AddPhonicsComponent} from './add-phonics/add-phonics.component';
import {HelmetChartComponent} from './helmet-chart/helmet-chart.component';
import {StationChartComponent} from './station-chart/station-chart.component';
import {ChartSettingComponent} from './chart-setting/chart-setting.component';
import {DataMapComponent} from './data-map/data-map.component';
import {UnsavedGuard} from "../shared/cookies/unsaved.guard";
import {ChartGuard} from "../shared/cookies/chart.guard";

export const routes:Routes = [
    {
        path: 'equipment-positioning',
        component: EquipmentPositioningComponent,
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
        path: 'helmet-chart',
        component: HelmetChartComponent
    },
    {
        path: 'station-chart',
        component: StationChartComponent,
        canDeactivate:[ChartGuard]  //路由守卫
    },
    {
        path: 'station-list',
        component: StationListComponent
    },
    {
        path: 'chart-setting',
        component: ChartSettingComponent
    },
    {
        path: 'data-map',
        component: DataMapComponent,
        canDeactivate:[UnsavedGuard]  //路由守卫
    },
    {
        path: 'phonics',
        component: AddPhonicsComponent
    },
    {
        path: 'i3otp/:i_id',
        component: AddI3otpComponent
    },
];

export const routing = RouterModule.forChild(routes)