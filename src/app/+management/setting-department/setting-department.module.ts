import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingDepartmentRoutingModule } from './setting-department-routing.module';
import { SettingDepartmentComponent } from './setting-department.component';
import {I3otpModule} from '../../shared/i3otp.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {CookieService} from 'angular2-cookie/core';

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    SettingDepartmentRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SettingDepartmentComponent],
  providers:[ CookieService,CookieStoreService ]
})
export class SettingDepartmentModule { }
