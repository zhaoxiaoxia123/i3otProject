import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalSettingsRoutingModule } from './personal-settings-routing.module';
import { PersonalSettingsComponent } from './personal-settings.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    PersonalSettingsRoutingModule
  ],
  declarations: [PersonalSettingsComponent]
})
export class PersonalSettingsModule { }
