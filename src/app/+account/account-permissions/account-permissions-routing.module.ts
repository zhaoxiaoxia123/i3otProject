import { Routes, RouterModule } from '@angular/router';
import {AccountPermissionsComponent} from "./account-permissions.component";

export const AccountPermissionsRoutes: Routes = [{
    path: '',
    component: AccountPermissionsComponent
}];
export const AccountPermissionsRoutingModule = RouterModule.forChild(AccountPermissionsRoutes);
