import { Routes, RouterModule } from '@angular/router';
import { AddCustomer1Component } from './add-customer1.component';

export const addCustomer1Routes: Routes = [{
    path: '',
    component: AddCustomer1Component
}];
export const addCustomer1Routing = RouterModule.forChild(addCustomer1Routes);
