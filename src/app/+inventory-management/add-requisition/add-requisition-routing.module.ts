import { Routes, RouterModule } from '@angular/router';
import {AddRequisitionComponent} from "./add-requisition.component";

export const addRequisitionRoutes: Routes = [{
    path: '',
    component: AddRequisitionComponent
}];
export const AddRequisitionRoutingModule = RouterModule.forChild(addRequisitionRoutes);