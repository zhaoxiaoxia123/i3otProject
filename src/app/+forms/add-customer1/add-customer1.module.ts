import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {addCustomer1Routing} from './add-customer1-routing.module';
import { AddCustomer1Component } from './add-customer1.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SmartadminModule} from '../../shared/smartadmin.module';
import {SmartadminEditorsModule} from '../../shared/forms/editors/smartadmin-editors.module';
import {CookieService} from 'angular2-cookie/core';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SmartadminModule,
    SmartadminEditorsModule,
    addCustomer1Routing
  ],
  declarations: [AddCustomer1Component],
  providers:[ CookieService,CookieStoreService ]
})
export class AddCustomer1Module { }
