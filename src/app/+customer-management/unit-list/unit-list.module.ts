import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitListRoutingModule } from './unit-list-routing.module';
import { UnitListComponent } from './unit-list.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    UnitListRoutingModule
  ],
  declarations: [UnitListComponent]
})
export class UnitListModule { }
