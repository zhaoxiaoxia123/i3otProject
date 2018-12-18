import { Routes, RouterModule } from '@angular/router';
import {UnitListComponent} from "./unit-list.component";

export const unitListRoutes: Routes = [{
    path: '',
    component: UnitListComponent
}];
export const UnitListRoutingModule = RouterModule.forChild(unitListRoutes);
