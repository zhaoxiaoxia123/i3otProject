import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountMenuRoutingModule } from './account-menu-routing.module';
import { AccountMenuComponent } from './account-menu.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    AccountMenuRoutingModule
  ],
  declarations: [AccountMenuComponent]
})
export class AccountMenuModule { }
