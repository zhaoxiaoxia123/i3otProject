import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelmetProjectsRoutingModule } from './helmet-projects-routing.module';
import {SmartadminLayoutModule} from '../../shared/layout/layout.module';
import {SmartadminDatatableModule} from '../../shared/ui/datatable/smartadmin-datatable.module';
import {HelmetProjectsComponent} from './helmet-projects.component';

@NgModule({
  imports: [
    CommonModule,
    HelmetProjectsRoutingModule,
    SmartadminLayoutModule,
    SmartadminDatatableModule,
  ],
  declarations: [HelmetProjectsComponent]
})
export class HelmetProjectsModule { }
