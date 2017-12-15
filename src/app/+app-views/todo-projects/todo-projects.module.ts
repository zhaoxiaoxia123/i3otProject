import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoProjectsRoutingModule } from './todo-projects-routing.module';
import {SmartadminLayoutModule} from "../../shared/layout/layout.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";
import {TodoProjectsComponent} from "./todo-projects.component";

@NgModule({
  imports: [
    CommonModule,
      SmartadminLayoutModule,
      SmartadminDatatableModule,
    TodoProjectsRoutingModule
  ],
  declarations: [TodoProjectsComponent]
})
export class TodoProjectsModule { }
