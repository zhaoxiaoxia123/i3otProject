import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TodoMissionComponent} from "./todo-mission.component";

export const todoMissionRoutes: Routes = [{
    path: '',
    component: TodoMissionComponent
}];
export const TodoMissionRoutingModule = RouterModule.forChild(todoMissionRoutes);
