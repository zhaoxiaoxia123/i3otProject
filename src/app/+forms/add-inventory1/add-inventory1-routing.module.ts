import { Routes, RouterModule } from '@angular/router';
import {AddInventory1Component} from './add-inventory1.component';

export const addInventory1Routes: Routes = [{
    path: '',
    component: AddInventory1Component
}];
export const AddInventory1RoutingModule = RouterModule.forChild(addInventory1Routes);
