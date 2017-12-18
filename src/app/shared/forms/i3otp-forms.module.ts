

import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {CommonModule} from "@angular/common";
import {I3otpInputModule} from "./input/i3otp-input.module";
import {I3otpValidationModule} from "./validation/i3otp-validation.module";
import {DropzoneModule} from "./dropzone/dropzone.module";
import {I3otpWizardsModule} from "./wizards/i3otp-wizards.module";

@NgModule({
  imports: [FormsModule, CommonModule],
  declarations: [
  ],
  exports: [

    I3otpInputModule,

    I3otpValidationModule,

    DropzoneModule,
    I3otpWizardsModule,
  ]

})
export class I3otpFormsModule{}
