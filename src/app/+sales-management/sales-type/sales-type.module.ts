import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesTypeRoutingModule } from './sales-type-routing.module';
import { SalesTypeComponent } from './sales-type.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    SalesTypeRoutingModule
  ],
  declarations: [SalesTypeComponent]
})
export class SalesTypeModule { }
