import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingPersonnelRoutingModule } from './setting-personnel-routing.module';
import { SettingPersonnelComponent } from './setting-personnel.component';
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpEditorsModule,
      I3otpModule,
    SettingPersonnelRoutingModule
  ],
  declarations: [SettingPersonnelComponent]
})
export class SettingPersonnelModule { }
