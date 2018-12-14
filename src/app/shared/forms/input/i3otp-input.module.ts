import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ColorpickerDirective} from './colorpicker.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ColorpickerDirective
    ],
    exports: [
        ColorpickerDirective
    ]
})
export class I3otpInputModule { }
