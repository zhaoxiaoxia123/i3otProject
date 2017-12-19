import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelmetProjectsRoutingModule } from './helmet-projects-routing.module';
import {I3otpLayoutModule} from '../../shared/layout/layout.module';
import {I3otpDatatableModule} from '../../shared/ui/datatable/i3otp-datatable.module';
import {HelmetProjectsComponent} from './helmet-projects.component';

@NgModule({
  imports: [
    CommonModule,
    HelmetProjectsRoutingModule,
    I3otpLayoutModule,
    I3otpDatatableModule,
  ],
  declarations: [HelmetProjectsComponent]
})
export class HelmetProjectsModule { }
