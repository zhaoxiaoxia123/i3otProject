import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingProduct3typeRoutingModule } from './setting-product3type-routing.module';
import { SettingProduct3typeComponent } from './setting-product3type.component';
import {SmartadminEditorsModule} from '../../shared/forms/editors/smartadmin-editors.module';
import {SmartadminModule} from '../../shared/smartadmin.module';
import {NestableListModule} from '../../shared/ui/nestable-list/nestable-list.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CookieService} from 'angular2-cookie/core';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';

@NgModule({
  imports: [
    CommonModule,
      SmartadminEditorsModule,
      SmartadminModule,
    SettingProduct3typeRoutingModule,
      NestableListModule,
      ReactiveFormsModule
  ],
  declarations: [SettingProduct3typeComponent],
  providers:[ CookieService,CookieStoreService ]
})
export class SettingProduct3typeModule { }
