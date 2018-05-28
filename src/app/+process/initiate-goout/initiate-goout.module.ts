import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitiateGooutRoutingModule } from './initiate-goout-routing.module';
import { InitiateGooutComponent } from './initiate-goout.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {CookieService} from "angular2-cookie/core";
import {DpDatePickerModule} from "ng2-date-picker";
import {SelectFileModule} from "../../shared/common/select-file/select-file.module";
import {SelectUserModule} from "../../shared/common/select-user/select-user.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    InitiateGooutRoutingModule,
    DpDatePickerModule,
    SelectUserModule,
    SelectFileModule
  ],
  declarations: [InitiateGooutComponent],
  providers:[ CookieService,CookieStoreService ]
})
export class InitiateGooutModule { }
