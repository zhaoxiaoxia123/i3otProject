import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddInventory1RoutingModule } from './add-inventory1-routing.module';
import { AddInventory1Component } from './add-inventory1.component';
import { ReactiveFormsModule} from '@angular/forms';
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
    AddInventory1RoutingModule,
  ],
  declarations: [AddInventory1Component],
  providers:[ CookieService,CookieStoreService ]
})
export class AddInventory1Module { }
