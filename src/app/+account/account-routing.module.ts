
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'account-company',
        loadChildren: 'app/+account/account-company/account-company.module#AccountCompanyModule',
        data: {pageTitle: 'AccountCompany'}
    },
    /*{
        path: 'account-password',
        loadChildren: 'app/+account/account-password/account-password.module#AccountPasswordModule',
        data: {pageTitle: 'AccountPassword'}
    },*/
    /*{
        path: 'account-personal',
        loadChildren: 'app/+account/account-personal/account-personal.module#AccountPersonalModule',
        data: {pageTitle: 'AccountPersonal'}
    },*/
    /*{
        path: 'account-binding',
        loadChildren: 'app/+account/account-binding/account-binding.module#AccountBindingModule',
        data: {pageTitle: 'AccountBinding'}
    },*/
    {
        path: 'account-permissions',
        loadChildren: 'app/+account/account-permissions/account-permissions.module#AccountPermissionsModule',
        data: {pageTitle: 'AccountPermissions'}
    },
    {
        path: 'personal-settings',
        loadChildren: 'app/+account/personal-settings/personal-settings.module#PersonalSettingsModule',
        data: {pageTitle: 'PersonalSettings'}
    },
    {
        path: 'account-admin',
        loadChildren: 'app/+account/account-admin/account-admin.module#AccountAdminModule',
        data: {pageTitle: 'AccountAdmin'}
    },
    {
        path: 'account-menu',
        loadChildren: 'app/+account/account-menu/account-menu.module#AccountMenuModule',
        data: {pageTitle: 'AccountMenu'}
    },
    {
        path: 'address-ip',
        loadChildren: 'app/+account/address-ip/address-ip.module#AddressIpModule',
        data: {pageTitle: 'AddressIp'}
    },
];

export const routing = RouterModule.forChild(routes);