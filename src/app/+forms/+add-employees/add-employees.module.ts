import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AddEmployeesComponent } from './add-employees.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import {addEmployeesRouting} from './add-employees-routing.module';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import {SmartadminModule} from '../../shared/smartadmin.module';


@NgModule({
  imports: [
    CommonModule,
    SmartadminModule,
    addEmployeesRouting
  ],
  declarations: [AddEmployeesComponent, RegistrationFormComponent ]
})
export class AddEmployeesModule { }
