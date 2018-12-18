import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoMessageRoutingModule } from './todo-message-routing.module';
import { TodoMessageComponent } from './todo-message.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    TodoMessageRoutingModule
  ],
  declarations: [TodoMessageComponent]
})
export class TodoMessageModule { }
