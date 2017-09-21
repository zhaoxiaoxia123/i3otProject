import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddProduct1RoutingModule } from './add-product1-routing.module';
import { AddProduct1Component } from './add-product1.component';
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
    AddProduct1RoutingModule
  ],
  declarations: [AddProduct1Component],
  providers:[ CookieService,CookieStoreService ]
})
export class AddProduct1Module { }
