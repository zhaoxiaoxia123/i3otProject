import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddOutboundRoutingModule } from './add-outbound-routing.module';
import { AddOutboundComponent } from './add-outbound.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DpDatePickerModule} from "ng2-date-picker";
import {SelectUserModule} from "../../shared/common/select-user/select-user.module";
import {VerifyFrameModule} from "../../shared/common/verify-frame/verify-frame.module";
import {SelectStockModule} from "../../shared/common/select-stock/select-stock.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    FormsModule,
    ReactiveFormsModule,
    DpDatePickerModule,
    SelectUserModule,
    VerifyFrameModule,
    SelectStockModule,
    AddOutboundRoutingModule
  ],
  declarations: [AddOutboundComponent]
})
export class AddOutboundModule { }
