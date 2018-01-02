import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsStatisticalRoutingModule } from './assets-statistical-routing.module';
import { AssetsStatisticalComponent } from './assets-statistical.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    AssetsStatisticalRoutingModule
  ],
  declarations: [AssetsStatisticalComponent]
})
export class AssetsStatisticalModule { }
