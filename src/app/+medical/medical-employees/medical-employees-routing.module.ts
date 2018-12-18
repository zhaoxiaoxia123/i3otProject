import { Routes, RouterModule } from '@angular/router';
import {MedicalEmployeesComponent} from "./medical-employees.component";

export const MedicalEmployeesRoutes: Routes = [{
    path: '',
    component: MedicalEmployeesComponent
}];
export const MedicalEmployeesRoutingModule = RouterModule.forChild(MedicalEmployeesRoutes);
