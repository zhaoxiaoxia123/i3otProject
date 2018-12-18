import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingPriceRoutingModule } from './setting-price-routing.module';
import { SettingPriceComponent } from './setting-price.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    SettingPriceRoutingModule
  ],
  declarations: [SettingPriceComponent]
})
export class SettingPriceModule { }
