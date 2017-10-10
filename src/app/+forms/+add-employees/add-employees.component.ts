import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';


@FadeInTop()
@Component({
  selector: 'app-add-employees',
  templateUrl: './add-employees.component.html',
})
export class AddEmployeesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }


}
