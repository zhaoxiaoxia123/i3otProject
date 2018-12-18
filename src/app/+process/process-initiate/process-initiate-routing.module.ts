import { Routes, RouterModule } from '@angular/router';
import {ProcessInitiateComponent} from "./process-initiate.component";

export const ProcessInitiateRoutes: Routes = [{
    path: '',
    component: ProcessInitiateComponent
}];
export const ProcessInitiateRoutingModule = RouterModule.forChild(ProcessInitiateRoutes);
