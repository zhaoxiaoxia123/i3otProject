import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsIssueRoutingModule } from './assets-issue-routing.module';
import { AssetsIssueComponent } from './assets-issue.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {SelectUserModule} from "../../shared/common/select-user/select-user.module";
import {VerifyFrameModule} from "../../shared/common/verify-frame/verify-frame.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    SelectUserModule,
    VerifyFrameModule,
    AssetsIssueRoutingModule
  ],
  declarations: [AssetsIssueComponent]
})
export class AssetsIssueModule { }
