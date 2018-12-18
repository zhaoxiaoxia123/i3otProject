import {NgModule} from '@angular/core';
import {I3otpModule} from '../shared/i3otp.module'
import {routing} from './dashboard.routing';

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
