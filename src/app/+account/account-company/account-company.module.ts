import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountCompanyRoutingModule } from './account-company-routing.module';
import { AccountCompanyComponent } from './account-company.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    AccountCompanyRoutingModule
  ],
  declarations: [AccountCompanyComponent]
})
export class AccountCompanyModule { }
