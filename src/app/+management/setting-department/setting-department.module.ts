import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingDepartmentRoutingModule } from './setting-department-routing.module';
import { SettingDepartmentComponent } from './setting-department.component';
import {SmartadminEditorsModule} from '../../shared/forms/editors/smartadmin-editors.module';
import {SmartadminModule} from '../../shared/smartadmin.module';
import {NestableListModule} from '../../shared/ui/nestable-list/nestable-list.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
      SmartadminEditorsModule,
      SmartadminModule,
    SettingDepartmentRoutingModule,
      NestableListModule,
      ReactiveFormsModule
  ],
  declarations: [SettingDepartmentComponent]
})
export class SettingDepartmentModule { }
