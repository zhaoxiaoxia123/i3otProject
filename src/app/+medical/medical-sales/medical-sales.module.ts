import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalSalesRoutingModule } from './medical-sales-routing.module';
import { MedicalSalesComponent } from './medical-sales.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    MedicalSalesRoutingModule
  ],
  declarations: [MedicalSalesComponent]
})
export class MedicalSalesModule { }
