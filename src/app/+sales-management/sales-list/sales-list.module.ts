import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesListRoutingModule } from './sales-list-routing.module';
import { SalesListComponent } from './sales-list.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {VerifyFrameModule} from "../../shared/common/verify-frame/verify-frame.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    VerifyFrameModule,
    SalesListRoutingModule
  ],
  declarations: [SalesListComponent]
})
export class SalesListModule { }
