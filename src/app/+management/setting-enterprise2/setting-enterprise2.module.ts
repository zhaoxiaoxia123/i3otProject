import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingEnterprise2RoutingModule } from './setting-enterprise2-routing.module';
import { SettingEnterprise2Component } from './setting-enterprise2.component';
import {I3otpModule} from '../../shared/i3otp.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {CookieService} from 'angular2-cookie/core';

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    SettingEnterprise2RoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SettingEnterprise2Component],
  providers:[ CookieService,CookieStoreService ]
})
export class SettingEnterprise2Module { }
