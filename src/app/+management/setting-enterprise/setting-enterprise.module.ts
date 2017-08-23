import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {settingEnterpriseRouting} from './setting-enterprise-routing.module';
import { SettingEnterpriseComponent } from './setting-enterprise.component';
import {SmartadminEditorsModule} from '../../shared/forms/editors/smartadmin-editors.module';
import {SmartadminModule} from '../../shared/smartadmin.module';

@NgModule({
  imports: [
    CommonModule,
    SmartadminEditorsModule,
    SmartadminModule,
    settingEnterpriseRouting
  ],
  declarations: [SettingEnterpriseComponent]
})
export class SettingEnterpriseModule { }
