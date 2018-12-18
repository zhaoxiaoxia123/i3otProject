import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalInventoryRoutingModule } from './medical-inventory-routing.module';
import { MedicalInventoryComponent } from './medical-inventory.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    MedicalInventoryRoutingModule
  ],
  declarations: [MedicalInventoryComponent]
})
export class MedicalInventoryModule { }
