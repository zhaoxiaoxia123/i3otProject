import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingProduct4parametersRoutingModule } from './setting-product4parameters-routing.module';
import { SettingProduct4parametersComponent ,KeysPipe} from './setting-product4parameters.component';
import {I3otpModule} from '../../shared/i3otp.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CookieService} from 'angular2-cookie/core';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    SettingProduct4parametersRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
      SettingProduct4parametersComponent,
      KeysPipe
  ],
  providers:[ CookieService,CookieStoreService ]
})
export class SettingProduct4parametersModule { }
