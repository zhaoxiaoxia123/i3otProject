import { Routes, RouterModule } from '@angular/router';
import {AccountAdminComponent} from "./account-admin.component";


export const AccountAdminRoutes: Routes = [{
    path: '',
    component: AccountAdminComponent
}];
export const AccountAdminRoutingModule = RouterModule.forChild(AccountAdminRoutes);