import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountAdminRoutingModule } from './account-admin-routing.module';
import { AccountAdminComponent } from './account-admin.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
    AccountAdminRoutingModule
  ],
  declarations: [AccountAdminComponent]
})
export class AccountAdminModule { }
