import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EffectTabeComponent} from "./effect-tabe.component";


export const effectTabeRoutes: Routes = [{
    path: '',
    component: EffectTabeComponent
}];
export const EffectTabeRoutingModule = RouterModule.forChild(effectTabeRoutes);
