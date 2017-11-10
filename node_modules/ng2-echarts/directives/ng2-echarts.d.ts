import { ElementRef, KeyValueDiffers } from '@angular/core';
import { Ng2EchartsBase } from "./ng2-echarts-base";
export declare class Ng2Echarts extends Ng2EchartsBase {
    options: Object;
    constructor(ele: ElementRef, _differs: KeyValueDiffers);
    draw(opt: any): void;
}
