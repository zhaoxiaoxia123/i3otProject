import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountMenuRoutingModule } from './account-menu-routing.module';
import { AccountMenuComponent } from './account-menu.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
    ReactiveFormsModule,
    AccountMenuRoutingModule
  ],
  declarations: [AccountMenuComponent]
})
export class AccountMenuModule { }
