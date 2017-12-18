import {NgModule} from "@angular/core";

import {routing} from "./app-views.routing";
import {I3otpModule} from "../shared/i3otp.module";
import { TodoProjectsComponent } from './todo-projects/todo-projects.component';
import { SettingPersonnelComponent } from './setting-personnel/setting-personnel.component';

@NgModule({
    declarations: [],
    imports: [
        I3otpModule,
        routing,

    ],
    entryComponents: []
})
export class AppViewsModule {
}
