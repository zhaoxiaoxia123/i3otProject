import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutboundRoutingModule } from './outbound-routing.module';
import { OutboundComponent } from './outbound.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {VerifyFrameModule} from "../../shared/common/verify-frame/verify-frame.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    VerifyFrameModule,
    OutboundRoutingModule
  ],
  declarations: [OutboundComponent]
})
export class OutboundModule { }
