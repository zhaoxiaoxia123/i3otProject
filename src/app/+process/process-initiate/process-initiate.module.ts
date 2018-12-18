import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessInitiateRoutingModule } from './process-initiate-routing.module';
import { ProcessInitiateComponent } from './process-initiate.component';
import { InitiateLeaveComponent } from './initiate-leave/initiate-leave.component';
import { InitiateEvectionComponent } from './initiate-evection/initiate-evection.component';
import { InitiateGooutComponent } from './initiate-goout/initiate-goout.component';
import { InitiateRequiteComponent } from './initiate-requite/initiate-requite.component';
import { InitiateGeneralComponent } from './initiate-general/initiate-general.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpModule,
    ProcessInitiateRoutingModule
  ],
  declarations: [ProcessInitiateComponent]
})
export class ProcessInitiateModule { }
