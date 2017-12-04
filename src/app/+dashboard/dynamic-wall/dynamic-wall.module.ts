import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicWallRoutingModule } from './dynamic-wall-routing.module';
import {DynamicWallComponent} from "./dynamic-wall.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import { TodoWidgetComponent } from './todo-widget/todo-widget.component';
import { PanelElementComponent } from './panel-element/panel-element.component';
import { PanelStaffComponent } from './panel-staff/panel-staff.component';
import { PanelSellComponent } from './panel-sell/panel-sell.component';
import { PanelStorehouseComponent } from './panel-storehouse/panel-storehouse.component';
import { PanelProductsComponent } from './panel-products/panel-products.component';

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
      PanelStaffComponent,
      PanelSellComponent,
      PanelStorehouseComponent,
      PanelProductsComponent
  ]
})
export class DynamicWallModule { }
