import { NgModule }   from '@angular/core';
import { CommonModule }       from '@angular/common';
import {BigPicComponent} from "./big-pic.component";
import {I3otpModule} from "../../i3otp.module";

@NgModule({
    imports:
        [
            CommonModule,
            I3otpModule,
    ],
    declarations: [BigPicComponent],
    exports: [BigPicComponent],
})
export class BigPicModule { }


