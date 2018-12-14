import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitClassifyRoutingModule } from './unit-classify-routing.module';
import { UnitClassifyComponent } from './unit-classify.component';
import {I3otpModule} from "../../shared/i3otp.module";
//import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CookieService} from "angular2-cookie/core";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
    //  I3otpEditorsModule,
    FormsModule,
    ReactiveFormsModule,
    UnitClassifyRoutingModule
  ],
  declarations: [UnitClassifyComponent],
    providers:[ CookieService,CookieStoreService ]
})
export class UnitClassifyModule { }
