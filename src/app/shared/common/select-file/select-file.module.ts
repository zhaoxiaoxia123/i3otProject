import { NgModule }   from '@angular/core';
import { CommonModule }       from '@angular/common';
import {SelectFileComponent} from "./select-file.component";
import {FileUploadModule} from "ng2-file-upload";
import {I3otpEditorsModule} from "../../forms/editors/i3otp-editors.module";
import {I3otpModule} from "../../i3otp.module";

@NgModule({
    imports:
        [
            CommonModule,
            I3otpModule,
            I3otpEditorsModule,
            FileUploadModule
    ],
    declarations: [SelectFileComponent],
    exports: [SelectFileComponent],
})
export class SelectFileModule { }


