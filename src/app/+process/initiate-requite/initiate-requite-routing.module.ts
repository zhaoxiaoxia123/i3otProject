import { Routes, RouterModule } from '@angular/router';
import {InitiateRequiteComponent} from "./initiate-requite.component";

export const InitiateRequiteRoutes: Routes = [{
    path: '',
    component: InitiateRequiteComponent
}];
export const InitiateRequiteRoutingModule = RouterModule.forChild(InitiateRequiteRoutes);
