import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitiateEvectionRoutingModule } from './initiate-evection-routing.module';
import { InitiateEvectionComponent } from './initiate-evection.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    InitiateEvectionRoutingModule
  ],
  declarations: [InitiateEvectionComponent]
})
export class InitiateEvectionModule { }
