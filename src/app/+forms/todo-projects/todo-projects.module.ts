import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoProjectsRoutingModule } from './todo-projects-routing.module';
import { TodoProjectsComponent } from './todo-projects.component';
import {ReactiveFormsModule} from "@angular/forms";
import {I3otpModule} from "../../shared/i3otp.module";


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    I3otpModule,
    TodoProjectsRoutingModule
  ],
  declarations: [TodoProjectsComponent]
})
export class TodoProjectsModule { }
