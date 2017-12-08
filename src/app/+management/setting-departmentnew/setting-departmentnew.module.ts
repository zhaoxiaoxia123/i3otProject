import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingDepartmentnewRoutingModule } from './setting-departmentnew-routing.module';
import { SettingDepartmentnewComponent } from './setting-departmentnew.component';
import {SmartadminEditorsModule} from "../../shared/forms/editors/smartadmin-editors.module";
import {SmartadminModule} from "../../shared/smartadmin.module";

@NgModule({
  imports: [
    CommonModule,
      SmartadminEditorsModule,
      SmartadminModule,
    SettingDepartmentnewRoutingModule
  ],
  declarations: [SettingDepartmentnewComponent]
})
export class SettingDepartmentnewModule { }
