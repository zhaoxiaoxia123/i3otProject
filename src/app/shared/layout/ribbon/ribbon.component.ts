import { Component, OnInit } from '@angular/core';
import {LayoutService} from "../layout.service";
import {FadeInTop} from "../../animations/fade-in-top.decorator";

@FadeInTop()
@Component({
  selector: 'sa-ribbon',
  templateUrl: './ribbon.component.html'
})
export class RibbonComponent implements OnInit {

  constructor(private layoutService: LayoutService) {}

  ngOnInit() {
  }

  resetWidgets() {
    this.layoutService.factoryReset()
  }

}
