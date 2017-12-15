import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoProjectsRoutingModule } from './todo-projects-routing.module';
import { TodoProjectsComponent } from './todo-projects.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminEditorsModule} from "../../shared/forms/editors/smartadmin-editors.module";
import { TodoMissionComponent } from './todo-mission/todo-mission.component';

@NgModule({
  imports: [
    CommonModule,
      ReactiveFormsModule,
      SmartadminModule,
      SmartadminEditorsModule,
    TodoProjectsRoutingModule
  ],
  declarations: [TodoProjectsComponent, TodoMissionComponent]
})
export class TodoProjectsModule { }
