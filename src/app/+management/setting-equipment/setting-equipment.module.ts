import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingEquipmentRoutingModule } from './setting-equipment-routing.module';
import { SettingEquipmentComponent } from './setting-equipment.component';
import {SmartadminEditorsModule} from "../../shared/forms/editors/smartadmin-editors.module";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {NestableListModule} from "../../shared/ui/nestable-list/nestable-list.module";
import {ReactiveFormsModule} from "@angular/forms";
import {CookieService} from "angular2-cookie/core";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";

@NgModule({
  imports: [
    CommonModule,
      SmartadminEditorsModule,
      SmartadminModule,
    SettingEquipmentRoutingModule,
      NestableListModule,
      ReactiveFormsModule,
  ],
  declarations: [SettingEquipmentComponent],
    providers:[ CookieService,CookieStoreService ]
})
export class SettingEquipmentModule { }
