import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';

@FadeInTop()
@Component({
  selector: 'app-helmet-projects',
  templateUrl: './helmet-projects.component.html'
})
export class HelmetProjectsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }



}
