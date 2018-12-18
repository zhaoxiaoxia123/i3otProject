import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryEarlyRoutingModule } from './inventory-early-routing.module';
import { InventoryEarlyComponent } from './inventory-early.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {SelectProductModule} from "../../shared/common/select-product/select-product.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    SelectProductModule,
    InventoryEarlyRoutingModule
  ],
  declarations: [InventoryEarlyComponent]
})
export class InventoryEarlyModule { }
