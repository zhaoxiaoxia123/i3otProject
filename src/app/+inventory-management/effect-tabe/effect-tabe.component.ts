import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";

@FadeInTop()
@Component({
  selector: 'app-effect-tabe',
  templateUrl: './effect-tabe.component.html',
})
export class EffectTabeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
