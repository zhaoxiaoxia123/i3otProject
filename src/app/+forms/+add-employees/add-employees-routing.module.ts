import { Routes, RouterModule } from '@angular/router';
import {AddEmployeesComponent} from './add-employees.component';

export const addEmployeesRoutes: Routes = [{
    path: '',
    component: AddEmployeesComponent
}];
export const addEmployeesRouting = RouterModule.forChild(addEmployeesRoutes);
