import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-binding',
  templateUrl: './account-binding.component.html',
})
export class AccountBindingComponent implements OnInit {
    public state: any = {
        tabs: {
            demo3: 'hr1',
        },
    }

  constructor() { }

  ngOnInit() {
  }

}
