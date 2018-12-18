import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsCategoryRoutingModule } from './assets-category-routing.module';
import { AssetsCategoryComponent } from './assets-category.component';
import {I3otpModule} from "../../shared/i3otp.module";

@NgModule({
  imports: [
    CommonModule,
      I3otpModule,
    AssetsCategoryRoutingModule
  ],
  declarations: [AssetsCategoryComponent]
})
export class AssetsCategoryModule { }
