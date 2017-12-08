import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingConversionRoutingModule } from './setting-conversion-routing.module';
import { SettingConversionComponent } from './setting-conversion.component';
import {SmartadminEditorsModule} from "../../shared/forms/editors/smartadmin-editors.module";
import {SmartadminModule} from "../../shared/smartadmin.module";

@NgModule({
  imports: [
    CommonModule,
      SmartadminEditorsModule,
      SmartadminModule,
    SettingConversionRoutingModule
  ],
  declarations: [SettingConversionComponent]
})
export class SettingConversionModule { }
