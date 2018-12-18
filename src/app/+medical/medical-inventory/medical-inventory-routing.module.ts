import { Routes, RouterModule } from '@angular/router';
import {MedicalInventoryComponent} from "./medical-inventory.component";

export const MedicalInventoryRoutes: Routes = [{
    path: '',
    component: MedicalInventoryComponent
}];
export const MedicalInventoryRoutingModule = RouterModule.forChild(MedicalInventoryRoutes);
