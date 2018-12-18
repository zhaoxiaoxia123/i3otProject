import { Routes, RouterModule } from '@angular/router';
import {InitiateEvectionComponent} from "./initiate-evection.component";

export const InitiateEvectionRoutes: Routes = [{
    path: '',
    component: InitiateEvectionComponent
}];
export const InitiateEvectionRoutingModule = RouterModule.forChild(InitiateEvectionRoutes);
