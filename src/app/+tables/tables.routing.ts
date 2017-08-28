
import {ModuleWithProviders} from "@angular/core"
import {RouterModule, Routes} from "@angular/router";
import {ListStaffComponent} from './list-staff/list-staff.component';
import {ListProductComponent} from './list-product/list-product.component';
import {ListClientComponent} from './list-client/list-client.component';
import {ListProduct1Component} from './list-product1/list-product1.component';

export const routes:Routes = [

  {
    path: 'staff',
    component:ListStaffComponent ,
    data: {pageTitle: 'Staff'}

  },
    {
        path: 'client',
        component:ListClientComponent ,
        data: {pageTitle: 'Client'}

    },
    {
        path: 'product',
        component:ListProductComponent ,
        data: {pageTitle: 'Product'}

    },
    {
        path: 'product1',
        component:ListProduct1Component,
        data: {pageTitle: 'Product1'}

    }
];


export const routing = RouterModule.forChild(routes)
