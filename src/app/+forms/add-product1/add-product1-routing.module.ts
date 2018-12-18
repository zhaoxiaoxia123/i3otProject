import { Routes, RouterModule } from '@angular/router';
import {AddProduct1Component} from './add-product1.component';

export const addProduct1Routes: Routes = [{
    path: '',
    component: AddProduct1Component
}];
export const AddProduct1RoutingModule = RouterModule.forChild(addProduct1Routes);
