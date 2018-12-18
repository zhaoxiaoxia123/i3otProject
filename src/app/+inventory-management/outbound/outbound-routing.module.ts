import { Routes, RouterModule } from '@angular/router';
import {OutboundComponent} from "./outbound.component";

export const OutboundRoutes: Routes = [{
    path: '',
    component: OutboundComponent
}];
export const OutboundRoutingModule = RouterModule.forChild(OutboundRoutes);
