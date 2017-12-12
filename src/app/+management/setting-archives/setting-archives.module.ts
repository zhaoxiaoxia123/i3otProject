import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingArchivesRoutingModule } from './setting-archives-routing.module';
import { SettingArchivesComponent } from './setting-archives.component';
import {SmartadminEditorsModule} from "../../shared/forms/editors/smartadmin-editors.module";
import {SmartadminModule} from "../../shared/smartadmin.module";

@NgModule({
  imports: [
    CommonModule,
      SmartadminEditorsModule,
      SmartadminModule,
    SettingArchivesRoutingModule
  ],
  declarations: [SettingArchivesComponent]
})
export class SettingArchivesModule { }
