import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddStorageRoutingModule } from './add-storage-routing.module';
import { AddStorageComponent } from './add-storage.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
      I3otpEditorsModule,
    AddStorageRoutingModule
  ],
  declarations: [AddStorageComponent]
})
export class AddStorageModule { }
