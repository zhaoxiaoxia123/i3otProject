import { Routes, RouterModule } from '@angular/router';
import {ProcurementReceiptComponent} from "./procurement-receipt.component";

export const procurementReceiptRoutes: Routes = [{
    path: '',
    component: ProcurementReceiptComponent
}];
export const ProcurementReceiptRoutingModule = RouterModule.forChild(procurementReceiptRoutes);
