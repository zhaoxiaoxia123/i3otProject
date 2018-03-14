import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddOutboundRoutingModule } from './add-outbound-routing.module';
import { AddOutboundComponent } from './add-outbound.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    AddOutboundRoutingModule
  ],
  declarations: [AddOutboundComponent]
})
export class AddOutboundModule { }
