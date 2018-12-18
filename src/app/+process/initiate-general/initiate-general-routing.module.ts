import { Routes, RouterModule } from '@angular/router';
import {InitiateGeneralComponent} from "./initiate-general.component";

export const InitiateGeneralRoutes: Routes = [{
    path: '',
    component: InitiateGeneralComponent
}];
export const InitiateGeneralRoutingModule = RouterModule.forChild(InitiateGeneralRoutes);
