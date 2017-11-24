import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {ActivatedRoute} from "@angular/router";


@FadeInTop()
@Component({
  selector: 'app-add-employees',
  templateUrl: './add-employees.component.html',
})
export class AddEmployeesComponent implements OnInit {

  u_id : number = 0;
  constructor(
      private routInfo : ActivatedRoute
  ) {
    this.u_id = this.routInfo.snapshot.params['u_id'];
  }

  ngOnInit() {
  }


}
