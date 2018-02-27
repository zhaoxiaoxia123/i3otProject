import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountBindingRoutingModule } from './account-binding-routing.module';
import { AccountBindingComponent } from './account-binding.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    AccountBindingRoutingModule
  ],
  declarations: [AccountBindingComponent]
})
export class AccountBindingModule { }
