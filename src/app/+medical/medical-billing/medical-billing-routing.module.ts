import { Routes, RouterModule } from '@angular/router';
import {MedicalBillingComponent} from "./medical-billing.component";

export const MedicalBillingRoutes: Routes = [{
    path: '',
    component: MedicalBillingComponent
}];
export const MedicalBillingRoutingModule = RouterModule.forChild(MedicalBillingRoutes);

