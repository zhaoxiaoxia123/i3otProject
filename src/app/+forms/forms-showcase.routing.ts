
import {ModuleWithProviders} from "@angular/core"
import {RouterModule, Routes} from "@angular/router";


export const routes:Routes = [
  {
    path: 'elements',
    loadChildren: 'app/+forms/+form-elements/form-elements.module#FormElementsModule',
    data: {pageTitle: 'Elements'}
  },
  {
    path: 'validation',
    loadChildren: 'app/+forms/+form-validation/form-validation.module#FormValidationModule',
    data: {pageTitle: 'Validation'}
  },
    {
        path: 'employees',
        loadChildren: 'app/+forms/+add-employees/add-employees.module#AddEmployeesModule',
        data: {pageTitle: 'Employees'}
    },
    {
        path: 'customer',
        loadChildren: 'app/+forms/add-customer/add-customer.module#AddCustomerModule',
        data: {pageTitle: 'Customer'}
    },
    {
        path: 'customer1',
        loadChildren: 'app/+forms/add-customer1/add-customer1.module#AddCustomer1Module',
        data: {pageTitle: 'Customer1'}
    }
];

export const routing = RouterModule.forChild(routes);
