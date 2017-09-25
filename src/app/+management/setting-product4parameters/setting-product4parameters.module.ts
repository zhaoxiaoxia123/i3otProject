import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingProduct4parametersRoutingModule } from './setting-product4parameters-routing.module';
import { SettingProduct4parametersComponent ,KeysPipe} from './setting-product4parameters.component';
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
    SettingProduct4parametersRoutingModule,
      NestableListModule,
      ReactiveFormsModule
  ],
  declarations: [
      SettingProduct4parametersComponent,
      KeysPipe
  ],
  providers:[ CookieService,CookieStoreService ]
})
export class SettingProduct4parametersModule { }
