import { Routes, RouterModule } from '@angular/router';
import {NfcPcscComponent} from "./nfc-pcsc.component";

export const NfcPcscRoutes: Routes = [{
    path: '',
    component: NfcPcscComponent
}];
export const NfcPcscRoutingModule = RouterModule.forChild(NfcPcscRoutes);
