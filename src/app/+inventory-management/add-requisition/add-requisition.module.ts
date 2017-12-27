import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddRequisitionRoutingModule } from './add-requisition-routing.module';
import { AddRequisitionComponent } from './add-requisition.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    AddRequisitionRoutingModule
  ],
  declarations: [AddRequisitionComponent]
})
export class AddRequisitionModule { }
