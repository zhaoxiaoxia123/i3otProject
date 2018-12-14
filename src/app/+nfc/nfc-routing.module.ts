import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'nfc-pcsc',
        loadChildren: 'app/+nfc/nfc-pcsc/nfc-pcsc.module#NfcPcscModule',
        data: {pageTitle: 'Nfc'}
    },

];

export const routing = RouterModule.forChild(routes);
