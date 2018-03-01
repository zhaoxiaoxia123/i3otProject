import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoMissionRoutingModule } from './todo-mission-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {TodoMissionComponent} from "./todo-mission.component";
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import { MissionDetailsComponent } from './mission-details/mission-details.component';

import { NgDragDropModule } from 'ng-drag-drop';
import {DpDatePickerModule} from 'ng2-date-picker';


@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
      ReactiveFormsModule,
    TodoMissionRoutingModule,
    DpDatePickerModule,
    NgDragDropModule.forRoot()
  ],
  declarations: [TodoMissionComponent, MissionDetailsComponent]
})
export class TodoMissionModule { }
