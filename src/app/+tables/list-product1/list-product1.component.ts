import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';

@FadeInTop()
@Component({
  selector: 'app-list-product1',
  templateUrl: './list-product1.component.html',
})
export class ListProduct1Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
