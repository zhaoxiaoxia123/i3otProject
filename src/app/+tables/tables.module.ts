import {NgModule} from '@angular/core';

import {SmartadminModule} from '../shared/smartadmin.module';

import {routing} from './tables.routing';
import {SmartadminDatatableModule} from "../shared/ui/datatable/smartadmin-datatable.module";
import { ListStaffComponent } from './list-staff/list-staff.component';
import { ListProductComponent } from './list-product/list-product.component';
import {CookieService} from 'angular2-cookie/core';
import {CookieStoreService} from '../shared/cookies/cookie-store.service';
import {ListClientComponent} from './list-client/list-client.component';



@NgModule({
  declarations: [

  ListStaffComponent,

  ListProductComponent,

    ListClientComponent,
  ],
  imports: [
    SmartadminModule,
    SmartadminDatatableModule,

    routing
  ],
  providers:[ CookieService,CookieStoreService ]
})
export class TablesModule {}
