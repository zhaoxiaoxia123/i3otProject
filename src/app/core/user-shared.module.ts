import { NgModule }   from '@angular/core';
import { CommonModule }       from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule,ImageCropperComponent } from 'ng2-img-cropper';
import {ImgCropperSelectModule} from "../shared/img-cropper-select/img-cropper-select.module";



/**
 * 用户共享模块
 */
@NgModule({
  imports:      [
     NgbModule,
     CommonModule,
     FormsModule,
     ReactiveFormsModule,
     ImageCropperModule,
     ImgCropperSelectModule
  ],
  declarations: [
      ImageCropperComponent
  ],
  entryComponents:[ImageCropperComponent],
  exports:      [ImageCropperComponent],
  providers:    []
})
export class UserSharedModule {
}
