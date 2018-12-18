import { Routes, RouterModule } from '@angular/router';
import {SalesListComponent} from "./sales-list.component";

export const salesListRoutes: Routes = [{
    path: '',
    component: SalesListComponent
}];
export const SalesListRoutingModule = RouterModule.forChild(salesListRoutes);
