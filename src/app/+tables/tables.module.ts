import {NgModule} from '@angular/core';

import {SmartadminModule} from '../shared/smartadmin.module';

import {routing} from './tables.routing';
import {SmartadminDatatableModule} from "../shared/ui/datatable/smartadmin-datatable.module";
import { ListStaffComponent } from './list-staff/list-staff.component';
import { ListProductComponent } from './list-product/list-product.component';
import {CookieService} from 'angular2-cookie/core';
import {CookieStoreService} from '../shared/cookies/cookie-store.service';
import {ListClientComponent} from './list-client/list-client.component';
import { ListProduct1Component } from './list-product1/list-product1.component';
import { ListClient1Component } from './list-client1/list-client1.component';
import { ListIndentComponent } from './list-indent/list-indent.component';
import { ListInventoryComponent } from './list-inventory/list-inventory.component';



@NgModule({
  declarations: [

    ListStaffComponent,

    ListProductComponent,

    ListClientComponent,

    ListProduct1Component,

    ListClient1Component,

    ListIndentComponent,

    ListInventoryComponent,
  ],
  imports: [
    SmartadminModule,
    SmartadminDatatableModule,

    routing
  ],
  providers:[ CookieService,CookieStoreService ]
})
export class TablesModule {}
