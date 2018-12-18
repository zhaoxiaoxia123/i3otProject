import { NgModule }   from '@angular/core';
import { CommonModule }       from '@angular/common';
import {SelectFileComponent} from "./select-file.component";
import {FileUploadModule} from "ng2-file-upload";
import {I3otpModule} from "../../i3otp.module";

@NgModule({
    imports:
        [
            CommonModule,
            I3otpModule,
            FileUploadModule
    ],
    declarations: [SelectFileComponent],
    exports: [SelectFileComponent],
})
export class SelectFileModule { }


