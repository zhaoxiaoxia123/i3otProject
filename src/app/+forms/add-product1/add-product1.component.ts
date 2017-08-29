import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';

@FadeInTop()
@Component({
  selector: 'app-add-product1',
  templateUrl: './add-product1.component.html',
})
export class AddProduct1Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
