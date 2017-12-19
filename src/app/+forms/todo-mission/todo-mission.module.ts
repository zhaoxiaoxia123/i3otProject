import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoMissionRoutingModule } from './todo-mission-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminEditorsModule} from "../../shared/forms/editors/smartadmin-editors.module";
import {TodoMissionComponent} from "./todo-mission.component";

@NgModule({
  imports: [
    CommonModule,
      ReactiveFormsModule,
      SmartadminModule,
      SmartadminEditorsModule,
    TodoMissionRoutingModule
  ],
  declarations: [TodoMissionComponent]
})
export class TodoMissionModule { }
