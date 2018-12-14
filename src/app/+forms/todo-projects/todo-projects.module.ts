import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoProjectsRoutingModule } from './todo-projects-routing.module';
import { TodoProjectsComponent } from './todo-projects.component';
import {ReactiveFormsModule} from "@angular/forms";
import {I3otpModule} from "../../shared/i3otp.module";
//import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";


@NgModule({
  imports: [
    CommonModule,
      ReactiveFormsModule,
      I3otpModule,
    //  I3otpEditorsModule,
    TodoProjectsRoutingModule
  ],
  declarations: [TodoProjectsComponent]
})
export class TodoProjectsModule { }
