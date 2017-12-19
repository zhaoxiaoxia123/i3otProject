import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingEnterprise1RoutingModule } from './setting-enterprise1-routing.module';
import { SettingEnterprise1Component } from './setting-enterprise1.component';
import {I3otpEditorsModule} from '../../shared/forms/editors/i3otp-editors.module';
import {I3otpModule} from '../../shared/i3otp.module';
import {NestableListModule} from '../../shared/ui/nestable-list/nestable-list.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {CookieService} from 'angular2-cookie/core';

@NgModule({
  imports: [
    CommonModule,
      I3otpEditorsModule,
      I3otpModule,
    SettingEnterprise1RoutingModule,
      NestableListModule,
      ReactiveFormsModule
  ],
  declarations: [SettingEnterprise1Component],
  providers:[ CookieService,CookieStoreService ]
})
export class SettingEnterprise1Module { }
