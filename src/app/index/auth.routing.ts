
import {ModuleWithProviders} from "@angular/core"
import {Routes, RouterModule} from "@angular/router";


export const routes:Routes = [
    {
        path: '',
        loadChildren: './homepage/homepage.module#HomepageModule'
    }
];

export const routing = RouterModule.forChild(routes);
