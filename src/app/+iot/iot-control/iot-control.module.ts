import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IotControlRoutingModule } from './iot-control-routing.module';
import { IotControlComponent } from './iot-control.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    IotControlRoutingModule
  ],
  declarations: [IotControlComponent]
})
export class IotControlModule { }
