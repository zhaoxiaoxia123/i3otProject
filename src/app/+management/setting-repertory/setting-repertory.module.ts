import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRepertoryRoutingModule } from './setting-repertory-routing.module';
import { SettingRepertoryComponent } from './setting-repertory.component';
import {SmartadminEditorsModule} from "../../shared/forms/editors/smartadmin-editors.module";
import {SmartadminModule} from "../../shared/smartadmin.module";

@NgModule({
  imports: [
    CommonModule,
      SmartadminEditorsModule,
      SmartadminModule,
    SettingRepertoryRoutingModule
  ],
  declarations: [SettingRepertoryComponent]
})
export class SettingRepertoryModule { }
