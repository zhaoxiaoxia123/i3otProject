import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formValidationRouting } from './form-validation.routing';
import {I3otpModule} from "../../shared/i3otp.module";
import {FormValidationComponent} from "./form-validation.component";

@NgModule({
  imports: [
    CommonModule,
    formValidationRouting,
    I3otpModule
  ],
  declarations: [FormValidationComponent]
})
export class FormValidationModule { }
