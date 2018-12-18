import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcurementOrderRoutingModule } from './procurement-order-routing.module';
import { ProcurementOrderComponent } from './procurement-order.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {VerifyFrameModule} from "../../shared/common/verify-frame/verify-frame.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    VerifyFrameModule,
    ProcurementOrderRoutingModule
  ],
  declarations: [ProcurementOrderComponent]
})
export class ProcurementOrderModule { }
