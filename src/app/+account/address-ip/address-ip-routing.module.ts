import { Routes, RouterModule } from '@angular/router';
import {AddressIpComponent} from "./address-ip.component";


export const AddressIpRoutes: Routes = [{
    path: '',
    component: AddressIpComponent
}];
export const AddressIpRoutingModule = RouterModule.forChild(AddressIpRoutes);

