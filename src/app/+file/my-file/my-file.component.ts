import { Component, OnInit } from '@angular/core';
import {GlobalService} from "../../core/global.service";

@Component({
  selector: 'app-my-file',
  templateUrl: './my-file.component.html',
})
export class MyFileComponent implements OnInit {


  rollback_url : string = '/file/my-file';
  constructor(
      private globalService:GlobalService,
  ) {
    let nav = '{"title":"我的文档","url":"/file/my-file","class_":"active"}';
    this.globalService.navEventEmitter.emit(nav);
  }
  ngOnInit() {
  }

}
