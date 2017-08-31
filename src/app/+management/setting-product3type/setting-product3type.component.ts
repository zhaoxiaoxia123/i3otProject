import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {JsonApiService} from "../../core/api/json-api.service";

@FadeInTop()
@Component({
  selector: 'app-setting-product3type',
  templateUrl: './setting-product3type.component.html',
})
export class SettingProduct3typeComponent implements OnInit {
    public states: Array<any>;
    public state: any = {
        tabs: {
            demo1: 0,
            demo2: 'tab-r1',
            demo3: 'hr1',
            demo4: 'AA',
            demo5: 'iss1',
            demo6: 'l1',
            demo7: 'tab1',
            demo8: 'hb1',
            demo9: 'A1',
            demo10: 'is1'
        },
    };
    public demo2: any;
    public nestable2DemoOutput: any;

  constructor(private jsonApiService:JsonApiService) {}

  ngOnInit() {
      this.jsonApiService.fetch('/ui-examples/nestable-lists.json').subscribe(data=> {
          this.demo2 = data.demo2;
      })
  }
    public onChange2(payload){
        this.nestable2DemoOutput = payload
    }

}
