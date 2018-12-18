import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";

@FadeInTop()
@Component({
  selector: 'app-setting-price',
  templateUrl: './setting-price.component.html',
})
export class SettingPriceComponent implements OnInit {
    public states: Array<any>;
    public state: any = {
        tabs: {
            demo3: 'hr1',
        },
    };

  constructor() { }

  ngOnInit() {
  }

}
