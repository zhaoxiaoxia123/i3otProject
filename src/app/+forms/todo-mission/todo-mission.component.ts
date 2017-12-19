import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";

const $script = require('scriptjs');

@FadeInTop()
@Component({
  selector: 'app-todo-mission',
  templateUrl: './todo-mission.component.html'
})
export class TodoMissionComponent implements OnInit {
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

  constructor() { }

  ngOnInit() {
      $script("https://cdn.ckeditor.com/4.5.11/standard/ckeditor.js", ()=> {
          const CKEDITOR = window['CKEDITOR'];

          CKEDITOR.replace('ckeditor-showcase');
      });
  }

}
