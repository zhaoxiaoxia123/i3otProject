import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes:Routes = [
    {
        path: 'enterprise',
        loadChildren: 'app/+management/setting-enterprise/setting-enterprise.module#SettingEnterpriseModule',
        data: {pageTitle: 'Setting Enterprise'}
    },
    {
        path: 'enterprise1',
        loadChildren: 'app/+management/setting-enterprise1/setting-enterprise1.module#SettingEnterprise1Module',
        data: {pageTitle: 'Setting Enterprise1'}
    },
    {
        path: 'enterprise2',
        loadChildren: 'app/+management/setting-enterprise2/setting-enterprise2.module#SettingEnterprise2Module',
        data: {pageTitle: 'Setting Enterprise2'}
    },
    {
        path: 'department',
        loadChildren: 'app/+management/setting-department/setting-department.module#SettingDepartmentModule',
        data: {pageTitle: 'Setting Department'}
    },
    {
        path: 'product3type',
        loadChildren: 'app/+management/setting-product3type/setting-product3type.module#SettingProduct3typeModule',
        data: {pageTitle: 'Setting Product3type'}
    },
    {
        path: 'setting-equipment',
        loadChildren: 'app/+management/setting-equipment/setting-equipment.module#SettingEquipmentModule',
        data: {pageTitle: 'Setting Equipment'}
    },
    {
        path: 'product4parameters',
        loadChildren: 'app/+management/setting-product4parameters/setting-product4parameters.module#SettingProduct4parametersModule',
        data: {pageTitle: 'Setting Product4parameters'}
    },
    {
        path: 'setting-personnel',
        loadChildren: 'app/+management/setting-personnel/setting-personnel.module#SettingPersonnelModule',
        data: {pageTitle: 'Setting Personnel'}
    },
    {
        path: 'setting-departmentnew',
        loadChildren: 'app/+management/setting-departmentnew/setting-departmentnew.module#SettingDepartmentnewModule',
        data: {pageTitle: 'Setting Departmentnew'}
    },
    {
        path: 'setting-honor',
        loadChildren: 'app/+management/setting-honor/setting-honor.module#SettingHonorModule',
        data: {pageTitle: 'Setting Honor'}
    },
    {
        path: 'setting-repertory',
        loadChildren: 'app/+management/setting-repertory/setting-repertory.module#SettingRepertoryModule',
        data: {pageTitle: 'Setting Repertory'}
    },
    {
        path: 'setting-archives',
        loadChildren: 'app/+management/setting-archives/setting-archives.module#SettingArchivesModule',
        data: {pageTitle: 'Setting Archives'}
    },
    {
        path: 'setting-conversion',
        loadChildren: 'app/+management/setting-conversion/setting-conversion.module#SettingConversionModule',
        data: {pageTitle: 'Setting Conversion'}
    },
    {
        path: 'setting-affiliation',
        loadChildren: 'app/+management/setting-affiliation/setting-affiliation.module#SettingAffiliationModule',
        data: {pageTitle: 'Setting Affiliation'}
    },
    {
        path: 'setting-openness',
        loadChildren: 'app/+management/setting-openness/setting-openness.module#SettingOpennessModule',
        data: {pageTitle: 'Setting Openness'}
    },
    {
        path: 'setting-formwork',
        loadChildren: 'app/+management/setting-formwork/setting-formwork.module#SettingFormworkModule',
        data: {pageTitle: 'Setting Formwork'}
    },
    {
        path: 'setting-labellinga',
        loadChildren: 'app/+management/setting-labellinga/setting-labellinga.module#SettingLabellingaModule',
        data: {pageTitle: 'Setting Labellinga'}
    },
    {
        path: 'setting-price',
        loadChildren: 'app/+management/setting-price/setting-price.module#SettingPriceModule',
        data: {pageTitle: 'SettingPrice'}
    },
    {
        path: 'total-project',
        loadChildren: 'app/+management/total-project/total-project.module#TotalProjectModule',
        data: {pageTitle: 'Total Project'}
    }
];

export const routing = RouterModule.forChild(routes);