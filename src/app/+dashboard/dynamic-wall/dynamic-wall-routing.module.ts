import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DynamicWallComponent} from "./dynamic-wall.component";

const routes: Routes = [{
    path: '',
    component: DynamicWallComponent,
    data: {pageTitle: 'dynamic-wall'}
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DynamicWallRoutingModule { }
