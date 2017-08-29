import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddProduct1RoutingModule } from './add-product1-routing.module';
import { AddProduct1Component } from './add-product1.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SmartadminModule} from '../../shared/smartadmin.module';
import {SmartadminEditorsModule} from '../../shared/forms/editors/smartadmin-editors.module';

@NgModule({
  imports: [
    CommonModule,
      ReactiveFormsModule,
      SmartadminModule,
      SmartadminEditorsModule,
    AddProduct1RoutingModule
  ],
  declarations: [AddProduct1Component]
})
export class AddProduct1Module { }
