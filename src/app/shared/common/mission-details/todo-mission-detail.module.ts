import { NgModule }   from '@angular/core';
import { CommonModule }       from '@angular/common';
import {TodoMissionDetailComponent} from "./todo-mission-detail.component";
import { ReactiveFormsModule} from "@angular/forms";
import {I3otpModule} from "../../i3otp.module";
import {DpDatePickerModule} from "ng2-date-picker";

@NgModule({
    imports:
        [
            CommonModule,
            ReactiveFormsModule,
            I3otpModule,
            DpDatePickerModule,
    ],
    declarations: [TodoMissionDetailComponent],
    exports: [TodoMissionDetailComponent],
})
export class TodoMissionDetailModule { }


