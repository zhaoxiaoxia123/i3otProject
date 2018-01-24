import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TotalProjectRoutingModule } from './total-project-routing.module';
import { TotalProjectComponent } from './total-project.component';
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {I3otpModule} from "../../shared/i3otp.module";
import {TreeViewModule} from "../../shared/ui/tree-view/tree-view.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpEditorsModule,
      I3otpModule,
      TreeViewModule,
      TotalProjectRoutingModule,
  ],
  declarations: [TotalProjectComponent]
})
export class TotalProjectModule { }
