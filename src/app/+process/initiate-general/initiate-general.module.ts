import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitiateGeneralRoutingModule } from './initiate-general-routing.module';
import { InitiateGeneralComponent } from './initiate-general.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    InitiateGeneralRoutingModule
  ],
  declarations: [InitiateGeneralComponent]
})
export class InitiateGeneralModule { }
