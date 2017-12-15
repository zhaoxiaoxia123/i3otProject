import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";

@FadeInTop()
@Component({
  selector: 'app-todo-projects',
  templateUrl: './todo-projects.component.html'
})
export class TodoProjectsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
