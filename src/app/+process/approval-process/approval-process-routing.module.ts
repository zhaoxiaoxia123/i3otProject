import { Routes, RouterModule } from '@angular/router';
import {ApprovalProcessComponent} from "./approval-process.component";

export const ApprovalProcessRoutes: Routes = [{
    path: '',
    component: ApprovalProcessComponent
}];
export const ApprovalProcessRoutingModule = RouterModule.forChild(ApprovalProcessRoutes);
