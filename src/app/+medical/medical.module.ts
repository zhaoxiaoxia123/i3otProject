import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {routing} from "./medical-routing.module";

@NgModule({
  imports: [
    CommonModule,
      routing
  ],
  declarations: []
})
export class MedicalModule { }
