import { Routes, RouterModule } from '@angular/router';
import {InventoryRequisitionComponent} from "./inventory-requisition.component";

export const inventoryRequisitionRoutes: Routes = [{
    path: '',
    component: InventoryRequisitionComponent
}];
export const InventoryRequisitionRoutingModule = RouterModule.forChild(inventoryRequisitionRoutes);
