import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryClassificationRoutingModule } from './inventory-classification-routing.module';
import { InventoryClassificationComponent } from './inventory-classification.component';
import {I3otpModule} from "../../shared/i3otp.module";
import {I3otpEditorsModule} from "../../shared/forms/editors/i3otp-editors.module";

@NgModule({
    imports: [
        CommonModule,
        I3otpModule,
        I3otpEditorsModule,
        InventoryClassificationRoutingModule
    ],
    declarations: [InventoryClassificationComponent]
})
export class InventoryClassificationModule { }