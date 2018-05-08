import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryNumberRoutingModule } from './inventory-number-routing.module';
import { InventoryNumberComponent } from './inventory-number.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    InventoryNumberRoutingModule
  ],
  declarations: [InventoryNumberComponent]
})
export class InventoryNumberModule { }
