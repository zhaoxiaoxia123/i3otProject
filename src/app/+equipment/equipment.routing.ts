
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
import {FullTablesComponent} from "./full-tables/full-tables.component";
import {TodoDetailsComponent} from "./todo-details/todo-details.component";
import {EquipmentListComponent} from "./equipment-list/equipment-list.component";
import {AddEquipmentComponent} from "./add-equipment/add-equipment.component";
import {HelmetChartGuard} from "../shared/cookies/helmetChart.guard";
import {PhonicsListComponent} from "./phonics-list/phonics-list.component";

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
        component: HelmetChartComponent,
        canDeactivate:[HelmetChartGuard]  //路由守卫
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
        path: 'phonics/:b_id',
        component: AddPhonicsComponent
    },
    {
        path: 'i3otp/:i_id',
        component: AddI3otpComponent
    },
    {
        path: 'full-tables',
        component: FullTablesComponent
    },
    {
        path: 'todo-details',
        component: TodoDetailsComponent
    },
    {
        path: 'equipment-list',
        component: EquipmentListComponent
    },
    {
        path: 'add-equipment/:i_id',
        component: AddEquipmentComponent
    },
    {
        path: 'phonics-list',
        component: PhonicsListComponent
    },
];

export const routing = RouterModule.forChild(routes)