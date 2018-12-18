import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountPermissionsRoutingModule } from './account-permissions-routing.module';
import { AccountPermissionsComponent } from './account-permissions.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
    AccountPermissionsRoutingModule
  ],
  declarations: [AccountPermissionsComponent]
})
export class AccountPermissionsModule { }
