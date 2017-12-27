import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddSalesRoutingModule } from './add-sales-routing.module';
import { AddSalesComponent } from './add-sales.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    AddSalesRoutingModule
  ],
  declarations: [AddSalesComponent]
})
export class AddSalesModule { }
