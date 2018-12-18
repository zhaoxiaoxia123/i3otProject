import { Routes, RouterModule } from '@angular/router';
import {MedicalSalesComponent} from "./medical-sales.component";

export const MedicalSalesRoutes: Routes = [{
    path: '',
    component: MedicalSalesComponent
}];
export const MedicalSalesRoutingModule = RouterModule.forChild(MedicalSalesRoutes);

