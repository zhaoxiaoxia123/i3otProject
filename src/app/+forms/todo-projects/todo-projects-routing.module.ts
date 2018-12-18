import { Routes, RouterModule } from '@angular/router';
import {TodoProjectsComponent} from "./todo-projects.component";

export const todoProjectsRoutes: Routes = [{
    path: '',
    component: TodoProjectsComponent
}];
export const TodoProjectsRoutingModule = RouterModule.forChild(todoProjectsRoutes);