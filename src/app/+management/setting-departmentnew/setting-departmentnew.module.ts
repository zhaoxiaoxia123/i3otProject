import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingDepartmentnewRoutingModule } from './setting-departmentnew-routing.module';
import { SettingDepartmentnewComponent } from './setting-departmentnew.component';
//import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {I3otpModule} from "../../shared/i3otp.module";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {CookieService} from "angular2-cookie/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
  //  I3otpEditorsModule,
    I3otpModule,
    FormsModule,
    ReactiveFormsModule,
    SettingDepartmentnewRoutingModule
  ],
  declarations: [SettingDepartmentnewComponent],
  providers:[ CookieService,CookieStoreService ]
})
export class SettingDepartmentnewModule { }
