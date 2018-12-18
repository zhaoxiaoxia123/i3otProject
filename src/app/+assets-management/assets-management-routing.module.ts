import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'assets-category',
        loadChildren: 'app/+assets-management/assets-category/assets-category.module#AssetsCategoryModule',
        data: {pageTitle: 'AssetsCategory'}
    },
    {
        path: 'assets-issue',
        loadChildren: 'app/+assets-management/assets-issue/assets-issue.module#AssetsIssueModule',
        data: {pageTitle: 'AssetsIssue'}
    },
    {
        path: 'assets-listing',
        loadChildren: 'app/+assets-management/assets-listing/assets-listing.module#AssetsListingModule',
        data: {pageTitle: 'AssetsListing'}
    },
    {
        path: 'assets-return',
        loadChildren: 'app/+assets-management/assets-return/assets-return.module#AssetsReturnModule',
        data: {pageTitle: 'AssetsReturn'}
    },
    {
        path: 'assets-scrap',
        loadChildren: 'app/+assets-management/assets-scrap/assets-scrap.module#AssetsScrapModule',
        data: {pageTitle: 'AssetsScrap'}
    },
    {
        path: 'assets-statistical',
        loadChildren: 'app/+assets-management/assets-statistical/assets-statistical.module#AssetsStatisticalModule',
        data: {pageTitle: 'AssetsStatistical'}
    },
];

export const routing = RouterModule.forChild(routes);
