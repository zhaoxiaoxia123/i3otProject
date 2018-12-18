import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProduct1RoutingModule } from './add-product1-routing.module';
import { AddProduct1Component } from './add-product1.component';
import {ReactiveFormsModule} from '@angular/forms';
import {I3otpModule} from '../../shared/i3otp.module';
import {CookieService} from 'angular2-cookie/core';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {DpDatePickerModule} from "ng2-date-picker";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    I3otpModule,
    DpDatePickerModule,
    AddProduct1RoutingModule
  ],
  declarations: [AddProduct1Component],
  providers:[ CookieService,CookieStoreService ]
})
export class AddProduct1Module { }
