import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalInventoryRoutingModule } from './medical-inventory-routing.module';
import { MedicalInventoryComponent } from './medical-inventory.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    MedicalInventoryRoutingModule
  ],
  declarations: [MedicalInventoryComponent]
})
export class MedicalInventoryModule { }
