import { NgModule }   from '@angular/core';
import { CommonModule }       from '@angular/common';
import {SelectProductComponent} from "./select-product.component";
import {I3otpModule} from "../../i3otp.module";

@NgModule({
    imports:
        [
            CommonModule,
            I3otpModule,
    ],
    declarations: [SelectProductComponent],
    exports: [SelectProductComponent],
})
export class SelectProductModule { }


