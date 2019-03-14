
/**
 * Created by Administrator on 2019/02/22
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadWriteDataComponent } from './read-write-data.component';
import {RouterModule, Routes} from "@angular/router";


const routes: Routes = [{
    path: '',
    component: ReadWriteDataComponent,
    data: {pageTitle: 'read-write-data'}
}];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    declarations: [ReadWriteDataComponent],
})
export class ReadWriteDataModule { }
