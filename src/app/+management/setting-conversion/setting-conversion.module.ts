import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingConversionRoutingModule } from './setting-conversion-routing.module';
import { SettingConversionComponent } from './setting-conversion.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    SettingConversionRoutingModule
  ],
  declarations: [SettingConversionComponent]
})
export class SettingConversionModule { }
