import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FormBindingComponent} from "./form-binding.component";

const routes: Routes = [{
    path: '',
    component: FormBindingComponent
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class FormBindingRoutingModule { }