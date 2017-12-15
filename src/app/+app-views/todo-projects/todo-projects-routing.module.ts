import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TodoProjectsComponent} from "./todo-projects.component";

export const TodoProjectsRoutes: Routes = [{
    path: '',
    component: TodoProjectsComponent
}];
export const TodoProjectsRoutingModule = RouterModule.forChild(TodoProjectsRoutes);
