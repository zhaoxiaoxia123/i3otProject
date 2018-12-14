import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {I3otpInputModule} from "./input/i3otp-input.module";

@NgModule({
  imports: [FormsModule, CommonModule],
  declarations: [
  ],
  exports: [
    I3otpInputModule,
  ]
})
export class I3otpFormsModule{}
