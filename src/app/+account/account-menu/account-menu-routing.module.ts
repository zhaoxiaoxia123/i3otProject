import { Routes, RouterModule } from '@angular/router';
import {AccountMenuComponent} from "./account-menu.component";

export const AccountMenuRoutes: Routes = [{
    path: '',
    component:AccountMenuComponent
}];
export const AccountMenuRoutingModule = RouterModule.forChild(AccountMenuRoutes);
