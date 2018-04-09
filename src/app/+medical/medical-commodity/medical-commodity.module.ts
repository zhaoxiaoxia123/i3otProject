import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalCommodityRoutingModule } from './medical-commodity-routing.module';
import { MedicalCommodityComponent } from './medical-commodity.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    MedicalCommodityRoutingModule
  ],
  declarations: [MedicalCommodityComponent]
})
export class MedicalCommodityModule { }
