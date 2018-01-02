import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsIssueRoutingModule } from './assets-issue-routing.module';
import { AssetsIssueComponent } from './assets-issue.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    AssetsIssueRoutingModule
  ],
  declarations: [AssetsIssueComponent]
})
export class AssetsIssueModule { }
