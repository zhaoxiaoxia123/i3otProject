import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {addCustomer1Routing} from './add-customer1-routing.module';
import { AddCustomer1Component } from './add-customer1.component';
import {ReactiveFormsModule} from '@angular/forms';
import {I3otpModule} from '../../shared/i3otp.module';
import {CookieService} from 'angular2-cookie/core';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    I3otpModule,
    addCustomer1Routing
  ],
  declarations: [AddCustomer1Component],
  providers:[ CookieService,CookieStoreService ]
})
export class AddCustomer1Module { }
