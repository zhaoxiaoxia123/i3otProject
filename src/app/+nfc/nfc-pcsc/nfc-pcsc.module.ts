import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NfcPcscRoutingModule } from './nfc-pcsc-routing.module';
import { NfcPcscComponent } from './nfc-pcsc.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    ReactiveFormsModule,
      HttpModule,
    NfcPcscRoutingModule
  ],
  declarations: [NfcPcscComponent]
})
export class NfcPcscModule { }
