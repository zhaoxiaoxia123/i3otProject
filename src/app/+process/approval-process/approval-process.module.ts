import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalProcessRoutingModule } from './approval-process-routing.module';
import { ApprovalProcessComponent } from './approval-process.component';
import { ProcessAwaitComponent } from './process-await/process-await.component';
import { ProcessAlreadyComponent } from './process-already/process-already.component';
import { ProcessMyComponent } from './process-my/process-my.component';
import { InitiateRequiteComponent } from './initiate-requite/initiate-requite.component';
import { ProcessCopyComponent } from './process-copy/process-copy.component';
import {I3otpModule} from "../../shared/i3otp.module";
//import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {BigPicModule} from "../../shared/common/big-pic/big-pic.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
   //   I3otpEditorsModule,
    BigPicModule,
    ApprovalProcessRoutingModule
  ],
  declarations: [ApprovalProcessComponent, ProcessAwaitComponent, ProcessAlreadyComponent, ProcessMyComponent, ProcessCopyComponent]
})
export class ApprovalProcessModule { }
