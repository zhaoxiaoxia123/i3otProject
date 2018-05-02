import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-admin',
  templateUrl: './account-admin.component.html',
})
export class AccountAdminComponent implements OnInit {
    public states: Array<any>;
    public state: any = {
        tabs: {
            demo3: 'hr1',
        },
    };

  constructor() { }

  ngOnInit() {
  }

}
