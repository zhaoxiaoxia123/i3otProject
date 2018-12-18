import { Routes, RouterModule } from '@angular/router';
import {TodoWorkbenchComponent} from "./todo-workbench.component";

export const TodoWorkbenchRoutes: Routes = [{
    path: '',
    component: TodoWorkbenchComponent
}];
export const TodoWorkbenchRoutingModule = RouterModule.forChild(TodoWorkbenchRoutes);
