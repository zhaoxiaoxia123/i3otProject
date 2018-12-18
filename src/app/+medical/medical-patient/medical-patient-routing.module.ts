import { Routes, RouterModule } from '@angular/router';
import {MedicalPatientComponent} from "./medical-patient.component";

export const MedicalPatientRoutes: Routes = [{
    path: '',
    component: MedicalPatientComponent
}];
export const MedicalPatientRoutingModule = RouterModule.forChild(MedicalPatientRoutes);
