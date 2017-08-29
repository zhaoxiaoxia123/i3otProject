import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';

@FadeInTop()
@Component({
  selector: 'app-add-indent1',
  templateUrl: './add-indent1.component.html',
})
export class AddIndent1Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
