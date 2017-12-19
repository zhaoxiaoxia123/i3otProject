import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { flotChartsRouting } from './flot-charts.routing';
import { FlotChartsComponent } from './flot-charts.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {FlotChartModule} from "../../shared/graphs/flot-chart/flot-chart.module";

@NgModule({
  imports: [
    CommonModule,
    flotChartsRouting,
    I3otpModule,
    FlotChartModule
  ],
  declarations: [FlotChartsComponent]
})
export class FlotChartsModule { }
