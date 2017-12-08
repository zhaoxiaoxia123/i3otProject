import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SettingHonorComponent } from './setting-honor.component';
import {SmartadminEditorsModule} from "../../shared/forms/editors/smartadmin-editors.module";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SettingHonorRoutingModule} from "./setting-honor-routing.module";

@NgModule({
  imports: [
    CommonModule,
      SmartadminEditorsModule,
      SmartadminModule,
      SettingHonorRoutingModule
  ],
  declarations: [SettingHonorComponent]
})
export class SettingHonorModule { }
