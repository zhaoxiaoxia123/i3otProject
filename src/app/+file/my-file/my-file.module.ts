import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyFileRoutingModule } from './my-file-routing.module';
import { MyFileComponent } from './my-file.component';
import {I3otpModule} from "../../shared/i3otp.module";


@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    MyFileRoutingModule
  ],
  declarations: [MyFileComponent]
})
export class MyFileModule { }
