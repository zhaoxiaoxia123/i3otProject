import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EquipmentBeaconComponent } from './equipment-beacon/equipment-beacon.component';
import { EquipmentPositioningComponent } from './equipment-positioning/equipment-positioning.component';
import { HelmetListComponent } from './helmet-list/helmet-list.component';
import { StationListComponent } from './station-list/station-list.component';
import {SmartadminModule} from '../shared/smartadmin.module';
import {SmartadminDatatableModule} from '../shared/ui/datatable/smartadmin-datatable.module';
import {routing} from './equipment.routing';
import {ReactiveFormsModule} from '@angular/forms';
import {AddI3otpComponent} from './add-i3otp/add-i3otp.component';
import {CookieStoreService} from '../shared/cookies/cookie-store.service';
import {CookieService} from 'angular2-cookie/core';
import { AddPhonicsComponent } from './add-phonics/add-phonics.component';

@NgModule({
  imports: [
    CommonModule,
    routing,
    SmartadminModule,
    SmartadminDatatableModule,
    ReactiveFormsModule
  ],
  declarations: [
    EquipmentBeaconComponent,
    EquipmentPositioningComponent,
    HelmetListComponent,
    StationListComponent,
    AddI3otpComponent,
    AddPhonicsComponent,
  ],
  providers:[CookieService,CookieStoreService ]
})
export class EquipmentModule { }
