import { Routes, RouterModule } from '@angular/router';
import {MyMailComponent} from "./my-mail.component";

export const MyMailRoutes: Routes = [{
    path: '',
    component: MyMailComponent
}];
export const MyMailRoutingModule = RouterModule.forChild(MyMailRoutes);
