

import {Routes, RouterModule} from '@angular/router';


export const routes: Routes = [
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
        path: 'employees/:u_id',
        loadChildren: 'app/+forms/+add-employees/add-employees.module#AddEmployeesModule',
        data: {pageTitle: 'Employees'}
    },
    {
        path: 'customer/:c_id',
        loadChildren: 'app/+forms/add-customer/add-customer.module#AddCustomerModule',
        data: {pageTitle: 'Customer'}
    },
    {
        path: 'customer1/:c_id',
        loadChildren: 'app/+forms/add-customer1/add-customer1.module#AddCustomer1Module',
        data: {pageTitle: 'Customer1'}
    },
    {
        path: 'product1/:p_id',
        loadChildren: 'app/+forms/add-product1/add-product1.module#AddProduct1Module',
        data: {pageTitle: 'Product1'}
    },
    {
        path: 'indent1/:o_id',
        loadChildren: 'app/+forms/add-indent1/add-indent1.module#AddIndent1Module',
        data: {pageTitle: 'Indent1'}
    },
    {
        path: 'inventory1/:storehouse_id',
        loadChildren: 'app/+forms/add-inventory1/add-inventory1.module#AddInventory1Module',
        data: {pageTitle: 'Inventory1'}
    }
/*    {
        path: 'inventory1',
        loadChildren: 'app/+forms/add-inventory1/add-inventory1.module#AddInventory1Module',
        data: {pageTitle: 'Inventory1'}
    }*/
];

export const routing = RouterModule.forChild(routes);
