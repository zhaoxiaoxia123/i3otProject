import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppOrderRoutingModule } from './app-order-routing.module';
import { AppOrderComponent } from './app-order.component';
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {I3otpModule} from "../../shared/i3otp.module";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CookieService} from 'angular2-cookie/core';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    FormsModule,
    ReactiveFormsModule,
    AppOrderRoutingModule
  ],
  declarations: [AppOrderComponent],
  providers:[ CookieService,CookieStoreService ]
})
export class AppOrderModule { }
