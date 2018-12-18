import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'approval-process/:info',
        loadChildren: 'app/+process/approval-process/approval-process.module#ApprovalProcessModule',
        data: {pageTitle: 'ApprovalProcess'}
    },
    {
        path: 'process-initiate',
        loadChildren: 'app/+process/process-initiate/process-initiate.module#ProcessInitiateModule',
        data: {pageTitle: 'ProcessInitiate'}
    },
    {
        path: 'initiate-evection',
        loadChildren: 'app/+process/initiate-evection/initiate-evection.module#InitiateEvectionModule',
        data: {pageTitle: 'InitiateEvection'}
    },
    {
        path: 'initiate-general',
        loadChildren: 'app/+process/initiate-general/initiate-general.module#InitiateGeneralModule',
        data: {pageTitle: 'InitiateGeneral'}
    },
    {
        path: 'initiate-goout',
        loadChildren: 'app/+process/initiate-goout/initiate-goout.module#InitiateGooutModule',
        data: {pageTitle: 'InitiateGoout'}
    },
    {
        path: 'initiate-leave',
        loadChildren: 'app/+process/initiate-leave/initiate-leave.module#InitiateLeaveModule',
        data: {pageTitle: 'InitiateLeave'}
    },
    {
        path: 'initiate-requite',
        loadChildren: 'app/+process/initiate-requite/initiate-requite.module#InitiateRequiteModule',
        data: {pageTitle: 'InitiateRequite'}
    },
];

export const routing = RouterModule.forChild(routes);