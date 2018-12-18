import { Routes, RouterModule } from '@angular/router';
import {InventoryClassificationComponent} from "./inventory-classification.component";


export const inventoryClassificationRoutes: Routes = [{
path: '',
component: InventoryClassificationComponent
}];
export const InventoryClassificationRoutingModule = RouterModule.forChild(inventoryClassificationRoutes);