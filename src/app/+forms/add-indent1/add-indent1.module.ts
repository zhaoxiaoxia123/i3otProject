import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddIndent1RoutingModule } from './add-indent1-routing.module';
import { AddIndent1Component } from './add-indent1.component';
import {ReactiveFormsModule} from '@angular/forms';
import {I3otpModule} from '../../shared/i3otp.module';
import {I3otpEditorsModule} from '../../shared/forms/editors/i3otp-editors.module';
import {CookieService} from 'angular2-cookie/core';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';

@NgModule({
  imports: [
    CommonModule,
      ReactiveFormsModule,
      I3otpModule,
      I3otpEditorsModule,
    AddIndent1RoutingModule
  ],
  declarations: [AddIndent1Component],
  providers:[ CookieService,CookieStoreService ]
})
export class AddIndent1Module { }
