import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";

@FadeInTop()
@Component({
  selector: 'app-dynamic-wall',
  templateUrl: './dynamic-wall.component.html',
})
export class DynamicWallComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
