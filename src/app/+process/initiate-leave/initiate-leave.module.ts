import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitiateLeaveRoutingModule } from './initiate-leave-routing.module';
import { InitiateLeaveComponent } from './initiate-leave.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    InitiateLeaveRoutingModule
  ],
  declarations: [InitiateLeaveComponent]
})
export class InitiateLeaveModule { }
