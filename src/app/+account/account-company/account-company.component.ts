import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";

@FadeInTop()
@Component({
  selector: 'app-account-company',
  templateUrl: './account-company.component.html',
})

export class AccountCompanyComponent implements OnInit {
    public state: any = {
        tabs: {
            demo3: 'hr1',
        },
}
  constructor() { }

  ngOnInit() {
  }

}
