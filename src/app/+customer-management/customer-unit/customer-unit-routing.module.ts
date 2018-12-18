import { Routes, RouterModule } from '@angular/router';
import {CustomerUnitComponent} from "./customer-unit.component";

export const CustomerUnitRoutes: Routes = [{
    path: '',
    component: CustomerUnitComponent
}];
export const CustomerUnitRoutingModule = RouterModule.forChild(CustomerUnitRoutes);