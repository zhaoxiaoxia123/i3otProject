import { Routes, RouterModule } from '@angular/router';
import {UnitClassifyComponent} from "./unit-classify.component";

export const unitClassifyRoutes: Routes = [{
    path: '',
    component: UnitClassifyComponent
}];
export const UnitClassifyRoutingModule = RouterModule.forChild(unitClassifyRoutes);
