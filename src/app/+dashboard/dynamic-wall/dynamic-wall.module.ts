import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicWallRoutingModule } from './dynamic-wall-routing.module';
import {DynamicWallComponent} from "./dynamic-wall.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import { TodoWidgetComponent } from './todo-widget/todo-widget.component';
import { PanelElementComponent } from './panel-element/panel-element.component';
import { PanelStaffComponent } from './panel-staff/panel-staff.component';

@NgModule({
  imports: [
    SmartadminModule,
    CommonModule,
    DynamicWallRoutingModule
  ],
  declarations: [
      DynamicWallComponent,
      TodoWidgetComponent,
      PanelElementComponent,
      PanelStaffComponent
  ]
})
export class DynamicWallModule { }
