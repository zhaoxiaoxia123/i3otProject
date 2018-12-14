import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsReturnRoutingModule } from './assets-return-routing.module';
import { AssetsReturnComponent } from './assets-return.component';
import {I3otpModule} from "../../shared/i3otp.module";
//import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
   //   I3otpEditorsModule,
    AssetsReturnRoutingModule
  ],
  declarations: [AssetsReturnComponent]
})
export class AssetsReturnModule { }
