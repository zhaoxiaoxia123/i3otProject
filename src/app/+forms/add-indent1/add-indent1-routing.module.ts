import { Routes, RouterModule } from '@angular/router';
import {AddIndent1Component} from './add-indent1.component';

export const addIndent1Routes: Routes = [{
    path: '',
    component: AddIndent1Component
}];
export const AddIndent1RoutingModule = RouterModule.forChild(addIndent1Routes);
