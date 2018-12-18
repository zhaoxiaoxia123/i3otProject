import { Routes, RouterModule } from '@angular/router';
import {AssetsIssueComponent} from "./assets-issue.component";

export const assetsIssueRoutes: Routes = [{
    path: '',
    component: AssetsIssueComponent
}];
export const AssetsIssueRoutingModule = RouterModule.forChild(assetsIssueRoutes);
