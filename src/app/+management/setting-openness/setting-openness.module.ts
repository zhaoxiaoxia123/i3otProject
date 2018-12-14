import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingOpennessRoutingModule } from './setting-openness-routing.module';
import { SettingOpennessComponent } from './setting-openness.component';
//import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
   //   I3otpEditorsModule,
      I3otpModule,
    SettingOpennessRoutingModule
  ],
  declarations: [SettingOpennessComponent]
})
export class SettingOpennessModule { }
