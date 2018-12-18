import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalPatientRoutingModule } from './medical-patient-routing.module';
import { MedicalPatientComponent } from './medical-patient.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    MedicalPatientRoutingModule
  ],
  declarations: [MedicalPatientComponent]
})
export class MedicalPatientModule { }
