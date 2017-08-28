import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {addCustomer1Routing} from './add-customer1-routing.module';
import { AddCustomer1Component } from './add-customer1.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SmartadminModule} from '../../shared/smartadmin.module';
import {SmartadminEditorsModule} from '../../shared/forms/editors/smartadmin-editors.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SmartadminModule,
    SmartadminEditorsModule,
    addCustomer1Routing
  ],
  declarations: [AddCustomer1Component]
})
export class AddCustomer1Module { }
