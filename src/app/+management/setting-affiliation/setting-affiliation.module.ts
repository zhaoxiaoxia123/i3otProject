import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingAffiliationRoutingModule } from './setting-affiliation-routing.module';
import { SettingAffiliationComponent } from './setting-affiliation.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    SettingAffiliationRoutingModule
  ],
  declarations: [SettingAffiliationComponent]
})
export class SettingAffiliationModule { }
