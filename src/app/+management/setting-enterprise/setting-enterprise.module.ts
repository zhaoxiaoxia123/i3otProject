import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {settingEnterpriseRouting} from './setting-enterprise-routing.module';
import { SettingEnterpriseComponent } from './setting-enterprise.component';
import {I3otpModule} from '../../shared/i3otp.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {CookieService} from 'angular2-cookie/core';

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    settingEnterpriseRouting,
    ReactiveFormsModule,
  ],
  declarations: [SettingEnterpriseComponent],
  providers:[ CookieService,CookieStoreService ]
})
export class SettingEnterpriseModule { }
