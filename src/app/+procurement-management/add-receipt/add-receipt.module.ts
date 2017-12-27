import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddReceiptRoutingModule } from './add-receipt-routing.module';
import { AddReceiptComponent } from './add-receipt.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    AddReceiptRoutingModule
  ],
  declarations: [AddReceiptComponent]
})
export class AddReceiptModule { }
