import { Routes, RouterModule } from '@angular/router';
import {MyFileComponent} from "./my-file.component";

export const MyFileRoutes: Routes = [{
    path: '',
    component: MyFileComponent
}];
export const MyFileRoutingModule = RouterModule.forChild(MyFileRoutes);
