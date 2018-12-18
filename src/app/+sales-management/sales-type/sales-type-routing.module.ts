import { Routes, RouterModule } from '@angular/router';
import {SalesTypeComponent} from "./sales-type.component";

export const salesTypeRoutes: Routes = [{
    path: '',
    component: SalesTypeComponent
}];
export const SalesTypeRoutingModule = RouterModule.forChild(salesTypeRoutes);
