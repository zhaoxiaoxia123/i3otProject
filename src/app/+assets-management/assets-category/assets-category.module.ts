import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsCategoryRoutingModule } from './assets-category-routing.module';
import { AssetsCategoryComponent } from './assets-category.component';
import {I3otpModule} from "../../shared/i3otp.module";
//import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
   //   I3otpEditorsModule,
    AssetsCategoryRoutingModule
  ],
  declarations: [AssetsCategoryComponent]
})
export class AssetsCategoryModule { }
