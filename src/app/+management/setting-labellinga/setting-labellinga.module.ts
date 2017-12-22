import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingLabellingaRoutingModule } from './setting-labellinga-routing.module';
import { SettingLabellingaComponent } from './setting-labellinga.component';
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpEditorsModule,
      I3otpModule,
    SettingLabellingaRoutingModule
  ],
  declarations: [SettingLabellingaComponent]
})
export class SettingLabellingaModule { }
