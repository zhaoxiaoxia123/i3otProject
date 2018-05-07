import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IotControlRoutingModule } from './iot-control-routing.module';
import { IotControlComponent } from './iot-control.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    IotControlRoutingModule
  ],
  declarations: [IotControlComponent]
})
export class IotControlModule { }
