import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { morrisChartsRouting } from './morris-charts.routing';
import { MorrisChartsComponent } from './morris-charts.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {MorrisGraphModule} from "../../shared/graphs/morris-graph/morris-graph.module";

@NgModule({
  imports: [
    CommonModule,
    morrisChartsRouting,
    I3otpModule,
    MorrisGraphModule
  ],
  declarations: [MorrisChartsComponent]
})
export class MorrisChartsModule { }
