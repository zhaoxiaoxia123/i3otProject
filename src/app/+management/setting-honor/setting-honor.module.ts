import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SettingHonorComponent } from './setting-honor.component';
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {I3otpModule} from "../../shared/i3otp.module";
import {SettingHonorRoutingModule} from "./setting-honor-routing.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpEditorsModule,
      I3otpModule,
      SettingHonorRoutingModule
  ],
  declarations: [SettingHonorComponent]
})
export class SettingHonorModule { }
