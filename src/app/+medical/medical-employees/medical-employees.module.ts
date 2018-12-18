import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalEmployeesRoutingModule } from './medical-employees-routing.module';
import { MedicalEmployeesComponent } from './medical-employees.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    MedicalEmployeesRoutingModule
  ],
  declarations: [MedicalEmployeesComponent]
})
export class MedicalEmployeesModule { }
