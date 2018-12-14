import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryClassificationRoutingModule } from './inventory-classification-routing.module';
import { InventoryClassificationComponent } from './inventory-classification.component';
import {I3otpModule} from "../../shared/i3otp.module";
//import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {CookieService} from "angular2-cookie/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        I3otpModule,
     //   I3otpEditorsModule,
        FormsModule,
        ReactiveFormsModule,
        InventoryClassificationRoutingModule
    ],
    declarations: [InventoryClassificationComponent],
    providers:[ CookieService,CookieStoreService ]
})
export class InventoryClassificationModule { }