import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-personal',
  templateUrl: './account-personal.component.html',
})
export class AccountPersonalComponent implements OnInit {
    public state: any = {
        tabs: {
            demo3: 'hr1',
        },
    }

  constructor() { }

  ngOnInit() {
  }

}
