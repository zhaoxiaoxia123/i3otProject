import { NgModule }   from '@angular/core';
import { CommonModule }       from '@angular/common';
import {SelectProductComponent} from "./select-product.component";
import {I3otpModule} from "../../i3otp.module";
//import {I3otpEditorsModule} from "../../forms/editors/i3otp-editors.module";


@NgModule({
    imports:
        [
            CommonModule,
            I3otpModule,
   //         I3otpEditorsModule,
    ],
    declarations: [SelectProductComponent],
    exports: [SelectProductComponent],
})
export class SelectProductModule { }


