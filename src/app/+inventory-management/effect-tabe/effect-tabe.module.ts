import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EffectTabeRoutingModule } from './effect-tabe-routing.module';
import { EffectTabeComponent } from './effect-tabe.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {I3otpDatatableModule} from "../../shared/ui/datatable/i3otp-datatable.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
      I3otpDatatableModule,
    EffectTabeRoutingModule
  ],
  declarations: [EffectTabeComponent]
})
export class EffectTabeModule { }
