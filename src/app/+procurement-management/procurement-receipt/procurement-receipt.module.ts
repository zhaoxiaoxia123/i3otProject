import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcurementReceiptRoutingModule } from './procurement-receipt-routing.module';
import { ProcurementReceiptComponent } from './procurement-receipt.component';
import {I3otpModule} from "../../shared/i3otp.module";
//import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {VerifyFrameModule} from "../../shared/common/verify-frame/verify-frame.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
     // I3otpEditorsModule,
    VerifyFrameModule,
    ProcurementReceiptRoutingModule
  ],
  declarations: [ProcurementReceiptComponent]
})
export class ProcurementReceiptModule { }
