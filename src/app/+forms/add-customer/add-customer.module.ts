import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCustomerComponent } from './add-customer.component';
import {I3otpModule} from '../../shared/i3otp.module';
import {addCustomerRouting} from './add-customer-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CookieService} from 'angular2-cookie/core';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    I3otpModule,
    addCustomerRouting
  ],
  declarations: [AddCustomerComponent],
  providers:[ CookieService,CookieStoreService ]
})
export class AddCustomerModule { }
