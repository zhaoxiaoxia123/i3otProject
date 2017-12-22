import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EffectTestComponent} from "./effect-test.component";


export const effectTestRoutes: Routes = [{
    path: '',
    component: EffectTestComponent
}];
export const EffectTestRoutingModule = RouterModule.forChild(effectTestRoutes);
