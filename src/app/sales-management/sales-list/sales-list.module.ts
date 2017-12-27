import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesListRoutingModule } from './sales-list-routing.module';
import { SalesListComponent } from './sales-list.component';
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    SalesListRoutingModule
  ],
  declarations: [SalesListComponent]
})
export class SalesListModule { }
