import {NgModule} from '@angular/core';

import {I3otpModule} from '../shared/i3otp.module';

import {routing} from './tables.routing';
import { ListStaffComponent } from './list-staff/list-staff.component';
import { ListProductComponent } from './list-product/list-product.component';
import {CookieService} from 'angular2-cookie/core';
import {CookieStoreService} from '../shared/cookies/cookie-store.service';
import {ListClientComponent} from './list-client/list-client.component';
import { ListClient1Component } from './list-client1/list-client1.component';
import { ListIndentComponent } from './list-indent/list-indent.component';
import { ListInventoryComponent } from './list-inventory/list-inventory.component';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    ListStaffComponent,
    ListProductComponent,
    ListClientComponent,
    ListClient1Component,
    ListIndentComponent,
    ListInventoryComponent,
  ],
  imports: [
    I3otpModule,
    ReactiveFormsModule,
    routing
  ],
  providers:[ CookieService,CookieStoreService ]
})
export class TablesModule {}
