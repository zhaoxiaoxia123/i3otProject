import {ModuleWithProviders} from "@angular/core"
import {Routes, RouterModule} from '@angular/router';

import {SparklinesComponent} from "./+sparklines/sparklines.component";
import {EasyPieChartsComponent} from "./+easy-pie-charts/easy-pie-charts.component";


export const routes: Routes = [
  {
    path: 'flot-charts',
    loadChildren: 'app/+graphs/+flot-charts/flot-charts.module#FlotChartsModule'
  },
  {
    path: 'morris-charts',
    loadChildren: 'app/+graphs/+morris-charts/morris-charts.module#MorrisChartsModule'
  },
  {
    path: 'sparklines',
    component: SparklinesComponent
  }
];

export const routing = RouterModule.forChild(routes);
