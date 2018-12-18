import { Routes, RouterModule } from '@angular/router';
import {AddOutboundComponent} from "./add-outbound.component";

export const AddOutboundRoutes: Routes = [{
    path: '',
    component: AddOutboundComponent
}];
export const AddOutboundRoutingModule = RouterModule.forChild(AddOutboundRoutes);
