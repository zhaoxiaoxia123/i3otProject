import { NgModule }   from '@angular/core';
import { CommonModule }       from '@angular/common';
import {SelectUserComponent} from "./select-user.component";
import {I3otpModule} from "../../i3otp.module";

@NgModule({
    imports:
        [
            CommonModule,
            I3otpModule,
    ],
    declarations: [SelectUserComponent],
    exports: [SelectUserComponent],
})
export class SelectUserModule { }


