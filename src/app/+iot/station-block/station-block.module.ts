import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StationBlockRoutingModule } from './station-block-routing.module';
import {StationBlockComponent} from './station-block.component';
import {I3otpModule} from "../../shared/i3otp.module";
//import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {AngularEchartsModule} from "ngx-echarts";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
   //   I3otpEditorsModule,
      AngularEchartsModule,
    StationBlockRoutingModule
  ],
  // exports : [
  //   KeysPipe
  // ],
  declarations: [StationBlockComponent]
})
export class StationBlockModule { }
