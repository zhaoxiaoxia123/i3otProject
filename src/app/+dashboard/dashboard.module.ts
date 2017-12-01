import {NgModule} from '@angular/core';

import {SmartadminModule} from '../shared/smartadmin.module'

import {routing} from './dashboard.routing';
import { DynamicWallComponent } from './dynamic-wall/dynamic-wall.component';
import { PanelElementComponent } from './panel-element/panel-element.component';


@NgModule({
  imports: [
    SmartadminModule,
    routing,
  ],
  declarations: [PanelElementComponent],
  providers: [],
})
export class DashboardModule {

}
