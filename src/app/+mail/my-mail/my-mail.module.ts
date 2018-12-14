import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyMailRoutingModule } from './my-mail-routing.module';
import { MyMailComponent } from './my-mail.component';
//import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
  //    I3otpEditorsModule,
    MyMailRoutingModule
  ],
  declarations: [MyMailComponent]
})
export class MyMailModule { }
