import { NgModule }   from '@angular/core';
import { CommonModule }       from '@angular/common';
import {SelectUserComponent} from "./select-user.component";
// import { ReactiveFormsModule} from "@angular/forms";
import {I3otpModule} from "../../i3otp.module";
import {I3otpEditorsModule} from "../../forms/editors/i3otp-editors.module";
// import {DpDatePickerModule} from "ng2-date-picker";


@NgModule({
    imports:
        [
            CommonModule,
            // ReactiveFormsModule,
            I3otpModule,
            I3otpEditorsModule,
            // DpDatePickerModule,
    ],
    declarations: [SelectUserComponent],
    exports: [SelectUserComponent],
})
export class SelectUserModule { }


