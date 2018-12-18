import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalBillingRoutingModule } from './medical-billing-routing.module';
import { MedicalBillingComponent } from './medical-billing.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {DpDatePickerModule} from "ng2-date-picker";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    FormsModule,
    ReactiveFormsModule,
    DpDatePickerModule,
    MedicalBillingRoutingModule
  ],
  declarations: [MedicalBillingComponent]
})
export class MedicalBillingModule { }
