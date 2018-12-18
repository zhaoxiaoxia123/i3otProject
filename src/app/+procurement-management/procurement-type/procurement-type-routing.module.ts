import { Routes, RouterModule } from '@angular/router';
import {ProcurementTypeComponent} from "./procurement-type.component";

export const procurementTypeRoutes: Routes = [{
    path: '',
    component: ProcurementTypeComponent
}];
export const ProcurementTypeRoutingModule = RouterModule.forChild(procurementTypeRoutes);
