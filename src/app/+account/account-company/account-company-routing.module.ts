import { Routes, RouterModule } from '@angular/router';
import {AccountCompanyComponent} from "./account-company.component";

export const AccountCompanyRoutes: Routes = [{
    path: '',
    component: AccountCompanyComponent
}];
export const AccountCompanyRoutingModule = RouterModule.forChild(AccountCompanyRoutes);
