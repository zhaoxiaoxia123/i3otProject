import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingProduct4parametersRoutingModule } from './setting-product4parameters-routing.module';
import { SettingProduct4parametersComponent ,KeysPipe} from './setting-product4parameters.component';
import {I3otpEditorsModule} from '../../shared/forms/editors/i3otp-editors.module';
import {I3otpModule} from '../../shared/i3otp.module';
import {NestableListModule} from '../../shared/ui/nestable-list/nestable-list.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CookieService} from 'angular2-cookie/core';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';

@NgModule({
  imports: [
    CommonModule,
      I3otpEditorsModule,
      I3otpModule,
    SettingProduct4parametersRoutingModule,
      NestableListModule,
      ReactiveFormsModule
  ],
  declarations: [
      SettingProduct4parametersComponent,
      KeysPipe
  ],
  providers:[ CookieService,CookieStoreService ]
})
export class SettingProduct4parametersModule { }
