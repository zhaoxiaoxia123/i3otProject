import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsStatisticalRoutingModule } from './assets-statistical-routing.module';
import { AssetsStatisticalComponent } from './assets-statistical.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    AssetsStatisticalRoutingModule
  ],
  declarations: [AssetsStatisticalComponent]
})
export class AssetsStatisticalModule { }
