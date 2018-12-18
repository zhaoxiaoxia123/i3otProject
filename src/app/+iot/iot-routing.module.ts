import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'station-block',
        loadChildren: 'app/+iot/station-block/station-block.module#StationBlockModule',
        data: {pageTitle: 'StationBlock'}
    },
    {
        path: 'iot-control',
        loadChildren: 'app/+iot/iot-control/iot-control.module#IotControlModule',
        data: {pageTitle: 'IotControl'}
    },

];

export const routing = RouterModule.forChild(routes);