import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryNumberRoutingModule } from './inventory-number-routing.module';
import { InventoryNumberComponent } from './inventory-number.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    InventoryNumberRoutingModule
  ],
  declarations: [InventoryNumberComponent]
})
export class InventoryNumberModule { }
