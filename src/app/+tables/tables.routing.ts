
import {ModuleWithProviders} from "@angular/core"
import {RouterModule, Routes} from "@angular/router";
import {ListStaffComponent} from './list-staff/list-staff.component';
import {ListProductComponent} from './list-product/list-product.component';
import {ListClientComponent} from './list-client/list-client.component';
import {ListClient1Component} from './list-client1/list-client1.component';
import {ListProduct1Component} from './list-product1/list-product1.component';
import {ListIndentComponent} from './list-indent/list-indent.component';
import {ListInventoryComponent} from './list-inventory/list-inventory.component';

export const routes:Routes = [

  {
    path: 'staff',
    component: ListStaffComponent ,
    data: {pageTitle: 'Staff'}
  },
    {
        path: 'client',
        component: ListClientComponent ,
        data: {pageTitle: 'Client'}
    },
    {
        path: 'client1',
        component: ListClient1Component ,
        data: {pageTitle1: 'Client'}
    },
    {
        path: 'product',
        component: ListProductComponent ,
        data: {pageTitle: 'Product'}
    },
    {
        path: 'product1',
        component: ListProduct1Component,
        data: {pageTitle: 'Product1'}
    },
    {
        path: 'indent',
        component: ListIndentComponent,
        data: {pageTitle: 'Indent'}
    },
    {
        path: 'inventory',
        component: ListInventoryComponent,
        data: {pageTitle: 'Inventory'}
    }
];


export const routing = RouterModule.forChild(routes)
