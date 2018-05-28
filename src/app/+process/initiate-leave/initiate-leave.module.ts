import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitiateLeaveRoutingModule } from './initiate-leave-routing.module';
import { InitiateLeaveComponent } from './initiate-leave.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DpDatePickerModule} from "ng2-date-picker";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {CookieService} from "angular2-cookie/core";
import {SelectFileModule} from "../../shared/common/select-file/select-file.module";
import {SelectUserModule} from "../../shared/common/select-user/select-user.module";


@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    InitiateLeaveRoutingModule,
  FormsModule,
  ReactiveFormsModule,
  DpDatePickerModule,
    SelectUserModule,
    SelectFileModule
],
declarations: [InitiateLeaveComponent],
    providers:[ CookieService,CookieStoreService ]
})
export class InitiateLeaveModule { }
