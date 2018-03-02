import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalSettingsRoutingModule } from './personal-settings-routing.module';
import { PersonalSettingsComponent } from './personal-settings.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import { AccountPersonalComponent } from './account-personal/account-personal.component';
import { AccountBindingComponent } from './account-binding/account-binding.component';
import { AccountPasswordComponent } from './account-password/account-password.component';
import {CookieService} from "angular2-cookie/core";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    FormsModule,
    ReactiveFormsModule,
    PersonalSettingsRoutingModule
],
declarations: [PersonalSettingsComponent, AccountPersonalComponent, AccountBindingComponent, AccountPasswordComponent],
providers:[ CookieService,CookieStoreService ]
 })
export class PersonalSettingsModule { }
