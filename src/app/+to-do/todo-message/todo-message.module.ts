import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoMessageRoutingModule } from './todo-message-routing.module';
import { TodoMessageComponent } from './todo-message.component';
import {I3otpModule} from "../../shared/i3otp.module";
//import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
   //   I3otpEditorsModule,
    TodoMessageRoutingModule
  ],
  declarations: [TodoMessageComponent]
})
export class TodoMessageModule { }
