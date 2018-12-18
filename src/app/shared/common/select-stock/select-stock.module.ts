import { NgModule }   from '@angular/core';
import { CommonModule }       from '@angular/common';
import {SelectStockComponent} from "./select-stock.component";
import {I3otpModule} from "../../i3otp.module";

@NgModule({
    imports:
        [
            CommonModule,
            I3otpModule,
    ],
    declarations: [SelectStockComponent],
    exports: [SelectStockComponent],
})
export class SelectStockModule { }


