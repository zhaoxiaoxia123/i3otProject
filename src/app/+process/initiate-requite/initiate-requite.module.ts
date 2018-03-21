import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitiateRequiteRoutingModule } from './initiate-requite-routing.module';
import { InitiateRequiteComponent } from './initiate-requite.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    InitiateRequiteRoutingModule
  ],
  declarations: [InitiateRequiteComponent]
})
export class InitiateRequiteModule { }
