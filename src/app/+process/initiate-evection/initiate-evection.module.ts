import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitiateEvectionRoutingModule } from './initiate-evection-routing.module';
import { InitiateEvectionComponent } from './initiate-evection.component';
import {I3otpModule} from "../../shared/i3otp.module";
//import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {CookieService} from "angular2-cookie/core";

import {DpDatePickerModule} from "ng2-date-picker";
import {SelectUserModule} from "../../shared/common/select-user/select-user.module";
import {SelectFileModule} from "../../shared/common/select-file/select-file.module";
import {BigPicModule} from "../../shared/common/big-pic/big-pic.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      //I3otpEditorsModule,
    InitiateEvectionRoutingModule,
    DpDatePickerModule,
    SelectUserModule,
    BigPicModule,
    SelectFileModule
  ],
  declarations: [InitiateEvectionComponent],
  providers:[ CookieService,CookieStoreService ]
})
export class InitiateEvectionModule { }
