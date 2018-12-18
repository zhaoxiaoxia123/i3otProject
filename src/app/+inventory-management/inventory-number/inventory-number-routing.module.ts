import { Routes, RouterModule } from '@angular/router';
import {InventoryNumberComponent} from "./inventory-number.component";

export const InventoryNumberRoutes: Routes = [{
    path: '',
    component: InventoryNumberComponent
}];
export const InventoryNumberRoutingModule = RouterModule.forChild(InventoryNumberRoutes);
