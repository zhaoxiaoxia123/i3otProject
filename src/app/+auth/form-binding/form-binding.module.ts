import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBindingRoutingModule } from './form-binding-routing.module';
import { FormBindingComponent } from './form-binding.component';

@NgModule({
  imports: [
    CommonModule,
    FormBindingRoutingModule
  ],
  declarations: [FormBindingComponent]
})
export class FormBindingModule { }
