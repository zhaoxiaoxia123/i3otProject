
import { NgModule } from '@angular/core';
import { I3otpModule } from '../shared/i3otp.module'
import {SparklinesComponent} from "./+sparklines/sparklines.component";
import { routing } from './graphs-showcase.routing';
import {InlineGraphsModule} from "../shared/graphs/inline/inline-graphs.module";

@NgModule({
    declarations: [
      SparklinesComponent,
    ],
    imports: [
        I3otpModule,
        routing
    ],
    providers: [],
})
export class GraphsShowcaseModule {

}
