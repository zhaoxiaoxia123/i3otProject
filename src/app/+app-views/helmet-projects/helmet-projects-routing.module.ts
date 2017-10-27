import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HelmetProjectsComponent} from './helmet-projects.component';

const routes: Routes = [{
    path: '',
    component: HelmetProjectsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelmetProjectsRoutingModule { }
