import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingLabellingaRoutingModule } from './setting-labellinga-routing.module';
import { SettingLabellingaComponent } from './setting-labellinga.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    SettingLabellingaRoutingModule
  ],
  declarations: [SettingLabellingaComponent]
})
export class SettingLabellingaModule { }
