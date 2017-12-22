import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EffectTestRoutingModule } from './effect-test-routing.module';
import { EffectTestComponent } from './effect-test.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {NestableListModule} from "../../shared/ui/nestable-list/nestable-list.module";
import {TreeViewModule} from "../../shared/ui/tree-view/tree-view.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
      NestableListModule,
      TreeViewModule,
    EffectTestRoutingModule
  ],
  declarations: [EffectTestComponent]
})
export class EffectTestModule { }
