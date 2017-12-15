import {NgModule} from "@angular/core";

import {routing} from "./app-views.routing";
import {SmartadminModule} from "../shared/smartadmin.module";
import { TodoProjectsComponent } from './todo-projects/todo-projects.component';
import { SettingPersonnelComponent } from './setting-personnel/setting-personnel.component';

@NgModule({
    declarations: [],
    imports: [
        SmartadminModule,
        routing,

    ],
    entryComponents: []
})
export class AppViewsModule {
}
