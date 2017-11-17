import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";


@FadeInTop()
@Component({
  selector: 'app-full-tables',
  templateUrl: './full-tables.component.html',
  styleUrls: ['./full-tables.component.css']
})
export class FullTablesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
