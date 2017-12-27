import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../../shared/animations/fade-in-top.decorator";


@FadeInTop()
@Component({
  selector: 'app-mission-details',
  templateUrl: './mission-details.component.html',
})
export class MissionDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
