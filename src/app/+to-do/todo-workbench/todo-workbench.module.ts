import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoWorkbenchRoutingModule } from './todo-workbench-routing.module';
import { TodoWorkbenchComponent } from './todo-workbench.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {ReactiveFormsModule} from "@angular/forms";
// import {DpDatePickerModule} from "ng2-date-picker";
import {NgDragDropModule} from "ng-drag-drop";
import {TodoMissionDetailModule} from "../../shared/common/mission-details/todo-mission-detail.module";


@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
      ReactiveFormsModule,
      // DpDatePickerModule,
      TodoMissionDetailModule,
    TodoWorkbenchRoutingModule,
      NgDragDropModule.forRoot()
  ],
  declarations: [TodoWorkbenchComponent]
})
export class TodoWorkbenchModule { }
