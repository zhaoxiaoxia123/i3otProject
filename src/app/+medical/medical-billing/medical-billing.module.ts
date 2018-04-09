import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalBillingRoutingModule } from './medical-billing-routing.module';
import { MedicalBillingComponent } from './medical-billing.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    MedicalBillingRoutingModule
  ],
  declarations: [MedicalBillingComponent]
})
export class MedicalBillingModule { }
