import { Routes, RouterModule } from '@angular/router';
import {InventoryEarlyComponent} from "./inventory-early.component";

export const InventoryEarlyRoutes: Routes = [{
    path: '',
    component: InventoryEarlyComponent
}];
export const InventoryEarlyRoutingModule = RouterModule.forChild(InventoryEarlyRoutes);
