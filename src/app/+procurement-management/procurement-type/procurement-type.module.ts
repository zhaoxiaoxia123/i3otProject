import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcurementTypeRoutingModule } from './procurement-type-routing.module';
import { ProcurementTypeComponent } from './procurement-type.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    ProcurementTypeRoutingModule
  ],
  declarations: [ProcurementTypeComponent]
})
export class ProcurementTypeModule { }
