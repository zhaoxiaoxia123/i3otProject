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
    //顶部菜单读取
    this.globalService.getMenuInfo();
  }
  ngOnInit() {
  }

}
