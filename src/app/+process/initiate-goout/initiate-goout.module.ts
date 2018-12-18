import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitiateGooutRoutingModule } from './initiate-goout-routing.module';
import { InitiateGooutComponent } from './initiate-goout.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {CookieService} from "angular2-cookie/core";
import {DpDatePickerModule} from "ng2-date-picker";
import {SelectFileModule} from "../../shared/common/select-file/select-file.module";
import {SelectUserModule} from "../../shared/common/select-user/select-user.module";
import {BigPicModule} from "../../shared/common/big-pic/big-pic.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    InitiateGooutRoutingModule,
    DpDatePickerModule,
    SelectUserModule,
    BigPicModule,
    SelectFileModule
  ],
  declarations: [InitiateGooutComponent],
  providers:[ CookieService,CookieStoreService ]
})
export class InitiateGooutModule { }
