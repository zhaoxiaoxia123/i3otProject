import { Routes, RouterModule } from '@angular/router';
import {AddReceiptComponent} from "./add-receipt.component";

export const addReceiptRoutes: Routes = [{
    path: '',
    component: AddReceiptComponent
}];
export const AddReceiptRoutingModule = RouterModule.forChild(addReceiptRoutes);
