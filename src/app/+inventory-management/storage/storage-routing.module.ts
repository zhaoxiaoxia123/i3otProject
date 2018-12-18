import { Routes, RouterModule } from '@angular/router';
import {StorageComponent} from "./storage.component";

export const StorageRoutes: Routes = [{
    path: '',
    component: StorageComponent
}];
export const StorageRoutingModule = RouterModule.forChild(StorageRoutes);
