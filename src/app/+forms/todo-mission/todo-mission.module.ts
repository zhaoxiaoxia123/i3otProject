import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoMissionRoutingModule } from './todo-mission-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {TodoMissionComponent} from "./todo-mission.component";
import {I3otpModule} from "../../shared/i3otp.module";
//import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import { NgDragDropModule } from 'ng-drag-drop';
// import {DpDatePickerModule} from 'ng2-date-picker';
import {TodoMissionDetailModule} from "../../shared/common/mission-details/todo-mission-detail.module";


@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
    //  I3otpEditorsModule,
      ReactiveFormsModule,
    TodoMissionRoutingModule,
    TodoMissionDetailModule,
    NgDragDropModule.forRoot()
  ],
  declarations: [TodoMissionComponent]
})
export class TodoMissionModule { }
