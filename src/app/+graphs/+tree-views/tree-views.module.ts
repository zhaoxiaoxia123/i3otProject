import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { treeViewsRouting } from './tree-views.routing';
import {TreeViewsComponent} from "./tree-views.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {TreeViewModule} from "../../shared/ui/tree-view/tree-view.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
    treeViewsRouting,
      I3otpEditorsModule,
      I3otpModule,
    TreeViewModule
  ],
  declarations: [TreeViewsComponent]
})
export class TreeViewsModule { }
