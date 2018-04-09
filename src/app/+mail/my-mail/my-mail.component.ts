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
    let nav = '{"title":"我的邮件","url":"/mail/my-mail","class_":"active"}';
    this.globalService.navEventEmitter.emit(nav);
  }

  ngOnInit() {
  }

}
