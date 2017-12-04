import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../../shared/animations/fade-in-top.decorator";

@FadeInTop()
@Component({
  selector: 'app-panel-element',
  templateUrl: './panel-element.component.html',
  styleUrls: ['./panel-element.component.css']
})
export class PanelElementComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
