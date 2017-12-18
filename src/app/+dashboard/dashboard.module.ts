import {NgModule} from '@angular/core';

import {I3otpModule} from '../shared/i3otp.module'

import {routing} from './dashboard.routing';
import { DynamicWallComponent } from './dynamic-wall/dynamic-wall.component';
/*import { PanelElementComponent } from './panel-element/panel-element.component';*/


@NgModule({
  imports: [
    I3otpModule,
    routing,
  ],
  declarations: [],
  providers: [],
})
export class DashboardModule {

}
