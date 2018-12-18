import { NgModule }   from '@angular/core';
import { CommonModule }       from '@angular/common';
import {VerifyFrameComponent} from "./verify-frame.component";
import {I3otpModule} from "../../i3otp.module";

@NgModule({
    imports:
        [
            CommonModule,
            I3otpModule,
    ],
    declarations: [VerifyFrameComponent],
    exports: [VerifyFrameComponent],
})
export class VerifyFrameModule { }


