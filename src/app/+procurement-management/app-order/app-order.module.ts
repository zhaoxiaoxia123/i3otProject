import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppOrderRoutingModule } from './app-order-routing.module';
import { AppOrderComponent } from './app-order.component';
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    AppOrderRoutingModule
  ],
  declarations: [AppOrderComponent]
})
export class AppOrderModule { }
