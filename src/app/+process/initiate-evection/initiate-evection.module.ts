import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitiateEvectionRoutingModule } from './initiate-evection-routing.module';
import { InitiateEvectionComponent } from './initiate-evection.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {CookieService} from "angular2-cookie/core";
import {ImgCropperSelectModule} from "../../shared/img-cropper-select/img-cropper-select.module";
import {ImageCropperModule} from "ng2-img-cropper";
import {DpDatePickerModule} from "ng2-date-picker";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    InitiateEvectionRoutingModule,
    DpDatePickerModule,
    ImageCropperModule,
    ImgCropperSelectModule
  ],
  declarations: [InitiateEvectionComponent],
  providers:[ CookieService,CookieStoreService ]
})
export class InitiateEvectionModule { }
