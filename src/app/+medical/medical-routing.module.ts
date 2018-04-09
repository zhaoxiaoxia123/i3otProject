import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'medical-billing',
        loadChildren: 'app/+medical/medical-billing/medical-billing.module#MedicalBillingModule',
        data: {pageTitle: 'MedicalBilling'}
    },
    {
        path: 'medical-commodity',
        loadChildren: 'app/+medical/medical-commodity/medical-commodity.module#MedicalCommodityModule',
        data: {pageTitle: 'MedicalCommodity'}
    },
    {
        path: 'medical-employees',
        loadChildren: 'app/+medical/medical-employees/medical-employees.module#MedicalEmployeesModule',
        data: {pageTitle: 'MedicalEmployees'}
    },
    {
        path: 'medical-inventory',
        loadChildren: 'app/+medical/medical-inventory/medical-inventory.module#MedicalInventoryModule',
        data: {pageTitle: 'MedicalInventory'}
    },
    {
        path: 'medical-patient',
        loadChildren: 'app/+medical/medical-patient/medical-patient.module#MedicalPatientModule',
        data: {pageTitle: 'MedicalPatient'}
    },
    {
        path: 'medical-sales',
        loadChildren: 'app/+medical/medical-sales/medical-sales.module#MedicalSalesModule',
        data: {pageTitle: 'MedicalSales'}
    },
];

export const routing = RouterModule.forChild(routes);