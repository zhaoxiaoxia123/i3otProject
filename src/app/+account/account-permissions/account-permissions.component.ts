import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-permissions',
  templateUrl: './account-permissions.component.html',
})
export class AccountPermissionsComponent implements OnInit {
    public state: any = {
        tabs: {
            demo3: 'hr1',
        },
    }

  constructor() { }

  ngOnInit() {
  }

}
