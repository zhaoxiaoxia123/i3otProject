import { Routes, RouterModule } from '@angular/router';
import {AddSalesComponent} from "./add-sales.component";

export const addSalesRoutes: Routes = [{
    path: '',
    component: AddSalesComponent
}];
export const AddSalesRoutingModule = RouterModule.forChild(addSalesRoutes);
