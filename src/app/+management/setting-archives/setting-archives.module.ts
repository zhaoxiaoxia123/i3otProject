import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingArchivesRoutingModule } from './setting-archives-routing.module';
import { SettingArchivesComponent } from './setting-archives.component';
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpEditorsModule,
      I3otpModule,
    SettingArchivesRoutingModule
  ],
  declarations: [SettingArchivesComponent]
})
export class SettingArchivesModule { }
