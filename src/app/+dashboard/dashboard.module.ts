import {NgModule} from '@angular/core';

import {SmartadminModule} from '../shared/smartadmin.module'

import {routing} from './dashboard.routing';
import { DynamicWallComponent } from './dynamic-wall/dynamic-wall.component';


@NgModule({
  imports: [
    SmartadminModule,
    routing,
  ],
  declarations: [],
  providers: [],
})
export class DashboardModule {

}
