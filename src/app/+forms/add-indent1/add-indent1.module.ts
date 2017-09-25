import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddIndent1RoutingModule } from './add-indent1-routing.module';
import { AddIndent1Component } from './add-indent1.component';
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
    AddIndent1RoutingModule
  ],
  declarations: [AddIndent1Component],
  providers:[ CookieService,CookieStoreService ]
})
export class AddIndent1Module { }
