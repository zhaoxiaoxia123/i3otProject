import { Routes, RouterModule } from '@angular/router';
import {MedicalCommodityComponent} from "./medical-commodity.component";

export const MedicalCommodityRoutes: Routes = [{
    path: '',
    component: MedicalCommodityComponent
}];
export const MedicalCommodityRoutingModule = RouterModule.forChild(MedicalCommodityRoutes);
