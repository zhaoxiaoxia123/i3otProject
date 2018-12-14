import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsListingRoutingModule } from './assets-listing-routing.module';
import { AssetsListingComponent } from './assets-listing.component';
import {I3otpModule} from "../../shared/i3otp.module";
//import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
  //    I3otpEditorsModule,
    AssetsListingRoutingModule
  ],
  declarations: [AssetsListingComponent]
})
export class AssetsListingModule { }
