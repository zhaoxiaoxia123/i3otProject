import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingArchivesRoutingModule } from './setting-archives-routing.module';
import { SettingArchivesComponent } from './setting-archives.component';
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {I3otpModule} from "../../shared/i3otp.module";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {CookieService} from "angular2-cookie/core";

@NgModule({
  imports: [
    CommonModule,
      I3otpEditorsModule,
      I3otpModule,
    FormsModule,
    ReactiveFormsModule,
    SettingArchivesRoutingModule
  ],
  declarations: [SettingArchivesComponent],
  providers:[ CookieService,CookieStoreService ]
})
export class SettingArchivesModule { }
