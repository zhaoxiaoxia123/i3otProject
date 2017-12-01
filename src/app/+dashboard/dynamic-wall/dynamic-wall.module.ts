import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicWallRoutingModule } from './dynamic-wall-routing.module';
import {DynamicWallComponent} from "./dynamic-wall.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import { TodoWidgetComponent } from './todo-widget/todo-widget.component';

@NgModule({
  imports: [
    SmartadminModule,
    CommonModule,
    DynamicWallRoutingModule
  ],
  declarations: [
      DynamicWallComponent,
      TodoWidgetComponent
  ]
})
export class DynamicWallModule { }
