import { NgModule }   from '@angular/core';
import { CommonModule }       from '@angular/common';
import {VerifyFrameComponent} from "./verify-frame.component";
import {I3otpModule} from "../../i3otp.module";
import {I3otpEditorsModule} from "../../forms/editors/i3otp-editors.module";


@NgModule({
    imports:
        [
            CommonModule,
            I3otpModule,
            I3otpEditorsModule,
    ],
    declarations: [VerifyFrameComponent],
    exports: [VerifyFrameComponent],
})
export class VerifyFrameModule { }


