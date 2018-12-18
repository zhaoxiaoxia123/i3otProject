import { Routes, RouterModule } from '@angular/router';
import {TodoMessageComponent} from "./todo-message.component";

export const TodoMessageRoutes: Routes = [{
    path: '',
    component: TodoMessageComponent
}];
export const TodoMessageRoutingModule = RouterModule.forChild(TodoMessageRoutes);