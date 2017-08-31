import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddInventory1RoutingModule } from './add-inventory1-routing.module';
import { AddInventory1Component } from './add-inventory1.component';
import { ReactiveFormsModule} from '@angular/forms';
import {SmartadminModule} from '../../shared/smartadmin.module';
import {SmartadminEditorsModule} from '../../shared/forms/editors/smartadmin-editors.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SmartadminModule,
    SmartadminEditorsModule,
    AddInventory1RoutingModule,
  ],
  declarations: [AddInventory1Component]
})
export class AddInventory1Module { }
