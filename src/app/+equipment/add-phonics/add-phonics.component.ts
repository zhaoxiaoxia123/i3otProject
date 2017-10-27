import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';

@Component({
  selector: 'app-add-phonics',
  templateUrl: './add-phonics.component.html',
  styleUrls: ['./add-phonics.component.css']
})

@FadeInTop()
export class AddPhonicsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
