import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountPersonalRoutingModule } from './account-personal-routing.module';
import { AccountPersonalComponent } from './account-personal.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    AccountPersonalRoutingModule
  ],
  declarations: [AccountPersonalComponent]
})
export class AccountPersonalModule { }
