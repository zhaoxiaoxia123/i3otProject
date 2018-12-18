import { Routes, RouterModule } from '@angular/router';
import {AddStorageComponent} from "./add-storage.component";

export const AddStorageRoutes: Routes = [{
    path: '',
    component: AddStorageComponent
}];
export const AddStorageRoutingModule = RouterModule.forChild(AddStorageRoutes);
