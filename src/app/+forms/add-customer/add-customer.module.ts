import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AddCustomerComponent } from './add-customer.component';
import {SmartadminModule} from '../../shared/smartadmin.module';
import {addCustomerRouting} from './add-customer-routing.module';
import {SmartadminEditorsModule} from '../../shared/forms/editors/smartadmin-editors.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CookieService} from 'angular2-cookie/core';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SmartadminModule,
    SmartadminEditorsModule,
    addCustomerRouting
  ],
  declarations: [AddCustomerComponent],
  providers:[ CookieService,CookieStoreService ]
})
export class AddCustomerModule { }
