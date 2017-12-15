import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoProjectsRoutingModule } from './todo-projects-routing.module';
import { TodoProjectsComponent } from './todo-projects.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminEditorsModule} from "../../shared/forms/editors/smartadmin-editors.module";

@NgModule({
  imports: [
    CommonModule,
      ReactiveFormsModule,
      SmartadminModule,
      SmartadminEditorsModule,
    TodoProjectsRoutingModule
  ],
  declarations: [TodoProjectsComponent]
})
export class TodoProjectsModule { }
