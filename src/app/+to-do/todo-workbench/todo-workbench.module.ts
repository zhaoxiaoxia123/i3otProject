import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoWorkbenchRoutingModule } from './todo-workbench-routing.module';
import { TodoWorkbenchComponent } from './todo-workbench.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {ReactiveFormsModule} from "@angular/forms";
import {NgDragDropModule} from "ng-drag-drop";
import {TodoMissionDetailModule} from "../../shared/common/mission-details/todo-mission-detail.module";


@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    ReactiveFormsModule,
    TodoMissionDetailModule,
    TodoWorkbenchRoutingModule,
    NgDragDropModule.forRoot()
  ],
  declarations: [TodoWorkbenchComponent]
})
export class TodoWorkbenchModule { }
