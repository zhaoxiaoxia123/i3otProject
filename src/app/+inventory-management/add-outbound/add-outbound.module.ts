import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddOutboundRoutingModule } from './add-outbound-routing.module';
import { AddOutboundComponent } from './add-outbound.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DpDatePickerModule} from "ng2-date-picker";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    FormsModule,
    ReactiveFormsModule,
    DpDatePickerModule,
    AddOutboundRoutingModule
  ],
  declarations: [AddOutboundComponent]
})
export class AddOutboundModule { }
