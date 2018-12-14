import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressIpRoutingModule } from './address-ip-routing.module';
import { AddressIpComponent } from './address-ip.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
    AddressIpRoutingModule
  ],
  declarations: [AddressIpComponent]
})
export class AddressIpModule { }
