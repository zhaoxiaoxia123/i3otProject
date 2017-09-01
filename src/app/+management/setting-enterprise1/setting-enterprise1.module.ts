import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingEnterprise1RoutingModule } from './setting-enterprise1-routing.module';
import { SettingEnterprise1Component } from './setting-enterprise1.component';
import {SmartadminEditorsModule} from '../../shared/forms/editors/smartadmin-editors.module';
import {SmartadminModule} from '../../shared/smartadmin.module';
import {NestableListModule} from '../../shared/ui/nestable-list/nestable-list.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
      SmartadminEditorsModule,
      SmartadminModule,
    SettingEnterprise1RoutingModule,
      NestableListModule,
      ReactiveFormsModule
  ],
  declarations: [SettingEnterprise1Component]
})
export class SettingEnterprise1Module { }
