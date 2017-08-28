import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';

@FadeInTop()
@Component({
  selector: 'app-add-customer1',
  templateUrl: './add-customer1.component.html',
})
export class AddCustomer1Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
