import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingEquipmentRoutingModule } from './setting-equipment-routing.module';
import { SettingEquipmentComponent } from './setting-equipment.component';
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {I3otpModule} from "../../shared/i3otp.module";
import {NestableListModule} from "../../shared/ui/nestable-list/nestable-list.module";
import {ReactiveFormsModule} from "@angular/forms";
import {CookieService} from "angular2-cookie/core";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";

@NgModule({
  imports: [
    CommonModule,
      I3otpEditorsModule,
      I3otpModule,
    SettingEquipmentRoutingModule,
      NestableListModule,
      ReactiveFormsModule,
  ],
  declarations: [SettingEquipmentComponent],
    providers:[ CookieService,CookieStoreService ]
})
export class SettingEquipmentModule { }
