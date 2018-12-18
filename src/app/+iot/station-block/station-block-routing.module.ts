import { Routes, RouterModule } from '@angular/router';
import {StationBlockComponent} from "./station-block.component";

export const StationBlockRoutes: Routes = [{
    path: '',
    component: StationBlockComponent
}];
export const StationBlockRoutingModule = RouterModule.forChild(StationBlockRoutes);
