import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";

@FadeInTop()
@Component({
  selector: 'app-dynamic-wall',
  templateUrl: './dynamic-wall.component.html',
  styleUrls: ['./dynamic-wall.component.css']
})
export class DynamicWallComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
