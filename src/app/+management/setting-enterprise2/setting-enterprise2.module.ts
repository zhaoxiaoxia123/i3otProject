import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingEnterprise2RoutingModule } from './setting-enterprise2-routing.module';
import { SettingEnterprise2Component } from './setting-enterprise2.component';
import {SmartadminEditorsModule} from '../../shared/forms/editors/smartadmin-editors.module';
import {SmartadminModule} from '../../shared/smartadmin.module';
import {NestableListModule} from '../../shared/ui/nestable-list/nestable-list.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
      SmartadminEditorsModule,
      SmartadminModule,
    SettingEnterprise2RoutingModule,
      NestableListModule,
      ReactiveFormsModule
  ],
  declarations: [SettingEnterprise2Component]
})
export class SettingEnterprise2Module { }
