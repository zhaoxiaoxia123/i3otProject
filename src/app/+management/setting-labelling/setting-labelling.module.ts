import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingLabellingRoutingModule } from './setting-labelling-routing.module';
import { SettingLabellingComponent } from './setting-labelling.component';
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpEditorsModule,
      I3otpModule,
    SettingLabellingRoutingModule
  ],
  declarations: [SettingLabellingComponent]
})
export class SettingLabellingModule { }
