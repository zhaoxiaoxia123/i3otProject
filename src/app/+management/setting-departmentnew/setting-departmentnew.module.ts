import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingDepartmentnewRoutingModule } from './setting-departmentnew-routing.module';
import { SettingDepartmentnewComponent } from './setting-departmentnew.component';
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpEditorsModule,
      I3otpModule,
    SettingDepartmentnewRoutingModule
  ],
  declarations: [SettingDepartmentnewComponent]
})
export class SettingDepartmentnewModule { }
