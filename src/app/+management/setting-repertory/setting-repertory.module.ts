import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingRepertoryRoutingModule } from './setting-repertory-routing.module';
import { SettingRepertoryComponent } from './setting-repertory.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    SettingRepertoryRoutingModule
  ],
  declarations: [SettingRepertoryComponent]
})
export class SettingRepertoryModule { }
