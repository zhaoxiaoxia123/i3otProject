import { Component, OnInit } from '@angular/core';
import {GlobalService} from "../../core/global.service";

@Component({
  selector: 'app-my-mail',
  templateUrl: './my-mail.component.html',
})
export class MyMailComponent implements OnInit {


  rollback_url : string = '/mail/my-mail';
  constructor(
      private globalService:GlobalService,
  ) {
    //顶部菜单读取
    this.globalService.getMenuInfo();
  }

  ngOnInit() {
  }

}
