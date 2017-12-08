import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingPersonnelRoutingModule } from './setting-personnel-routing.module';
import { SettingPersonnelComponent } from './setting-personnel.component';
import {SmartadminEditorsModule} from "../../shared/forms/editors/smartadmin-editors.module";
import {SmartadminModule} from "../../shared/smartadmin.module";

@NgModule({
  imports: [
    CommonModule,
      SmartadminEditorsModule,
      SmartadminModule,
    SettingPersonnelRoutingModule
  ],
  declarations: [SettingPersonnelComponent]
})
export class SettingPersonnelModule { }
