import { Routes, RouterModule } from '@angular/router';
import {InitiateGooutComponent} from "./initiate-goout.component";

export const InitiateGooutRoutes: Routes = [{
    path: '',
    component: InitiateGooutComponent
}];
export const InitiateGooutRoutingModule = RouterModule.forChild(InitiateGooutRoutes);
