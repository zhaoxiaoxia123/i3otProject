import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommodityClassifyRoutingModule } from './commodity-classify-routing.module';
import { CommodityClassifyComponent } from './commodity-classify.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    CommodityClassifyRoutingModule
  ],
  declarations: [CommodityClassifyComponent]
})
export class CommodityClassifyModule { }
