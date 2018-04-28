import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsScrapRoutingModule } from './assets-scrap-routing.module';
import { AssetsScrapComponent } from './assets-scrap.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {SelectUserModule} from "../../shared/common/select-user/select-user.module";
import {VerifyFrameModule} from "../../shared/common/verify-frame/verify-frame.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    SelectUserModule,
    VerifyFrameModule,
    AssetsScrapRoutingModule
  ],
  declarations: [AssetsScrapComponent]
})
export class AssetsScrapModule { }
