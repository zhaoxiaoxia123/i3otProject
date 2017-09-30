import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EquipmentBeaconComponent } from './equipment-beacon/equipment-beacon.component';
import { EquipmentPositioningComponent } from './equipment-positioning/equipment-positioning.component';
import { HelmetDetailsComponent } from './helmet-details/helmet-details.component';
import { HelmetListComponent } from './helmet-list/helmet-list.component';
import { StationDetailsComponent } from './station-details/station-details.component';
import { StationListComponent } from './station-list/station-list.component';
import {SmartadminModule} from '../shared/smartadmin.module';
import {SmartadminDatatableModule} from '../shared/ui/datatable/smartadmin-datatable.module';
import {routing} from './equipment-routing.module';

@NgModule({
  imports: [
    CommonModule,
    routing,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [EquipmentBeaconComponent, EquipmentPositioningComponent, HelmetDetailsComponent, HelmetListComponent, StationDetailsComponent, StationListComponent]
})
export class EquipmentModule { }
