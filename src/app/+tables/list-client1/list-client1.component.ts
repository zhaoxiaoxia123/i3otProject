import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';

@FadeInTop()
@Component({
  selector: 'app-list-client1',
  templateUrl: './list-client1.component.html',
})
export class ListClient1Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
