import { Routes, RouterModule } from '@angular/router';
import {IotControlComponent} from "./iot-control.component";

export const IotControlRoutes: Routes = [{
    path: '',
    component: IotControlComponent
}];
export const IotControlRoutingModule = RouterModule.forChild(IotControlRoutes);
