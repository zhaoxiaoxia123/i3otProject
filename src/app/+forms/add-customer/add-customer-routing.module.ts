import { Routes, RouterModule } from '@angular/router';
import {AddCustomerComponent} from './add-customer.component';

export const addCustomerRoutes: Routes = [{
    path: '',
    component: AddCustomerComponent
}];
export const addCustomerRouting = RouterModule.forChild(addCustomerRoutes);
