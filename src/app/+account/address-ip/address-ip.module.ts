import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressIpRoutingModule } from './address-ip-routing.module';
import { AddressIpComponent } from './address-ip.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    AddressIpRoutingModule
  ],
  declarations: [AddressIpComponent]
})
export class AddressIpModule { }
